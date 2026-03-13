import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isWeb = false;

  constructor() {
    this.isWeb = !Capacitor.isNativePlatform();
  }

  async initializeDatabase() {
    if (this.isWeb) {
      // For web, use IndexedDB or similar
      console.log('Web platform detected - using alternative storage');
      return;
    }

    try {
      this.db = await this.sqlite.createConnection('cricket_scoreboard', false, 'no-encryption', 1, false);
      await this.db.open();

      // Create tables
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  private async createTables() {
    const createMatchesTable = `
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team TEXT,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_runs INTEGER DEFAULT 0,
        total_wickets INTEGER DEFAULT 0,
        total_overs INTEGER DEFAULT 0
      );
    `;

    const createBattersTable = `
      CREATE TABLE IF NOT EXISTS batters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER,
        name TEXT,
        runs INTEGER DEFAULT 0,
        balls INTEGER DEFAULT 0,
        FOREIGN KEY (match_id) REFERENCES matches (id)
      );
    `;

    const createBowlersTable = `
      CREATE TABLE IF NOT EXISTS bowlers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER,
        name TEXT,
        overs INTEGER DEFAULT 0,
        runs INTEGER DEFAULT 0,
        wickets INTEGER DEFAULT 0
      );
    `;

    const createBallsTable = `
      CREATE TABLE IF NOT EXISTS balls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER,
        over_number INTEGER,
        ball_number INTEGER,
        result TEXT,
        FOREIGN KEY (match_id) REFERENCES matches (id)
      );
    `;

    await this.db.execute(createMatchesTable);
    await this.db.execute(createBattersTable);
    await this.db.execute(createBowlersTable);
    await this.db.execute(createBallsTable);
  }

  async saveMatch(matchData: any) {
    if (this.isWeb) return null;

    const insertMatch = `
      INSERT INTO matches (team, total_runs, total_wickets, total_overs)
      VALUES (?, ?, ?, ?);
    `;
    const result = await this.db.run(insertMatch, [matchData.team, matchData.runs, matchData.wickets, matchData.overs]);
    return result.lastId;
  }

  async saveBatter(matchId: number, batter: any) {
    if (this.isWeb) return;

    const insertBatter = `
      INSERT INTO batters (match_id, name, runs, balls)
      VALUES (?, ?, ?, ?);
    `;
    await this.db.run(insertBatter, [matchId, batter.name, batter.runs, batter.balls]);
  }

  async saveBowler(matchId: number, bowler: any) {
    if (this.isWeb) return;

    const insertBowler = `
      INSERT INTO bowlers (match_id, name, overs, runs, wickets)
      VALUES (?, ?, ?, ?, ?);
    `;
    await this.db.run(insertBowler, [matchId, bowler.name, bowler.overs, bowler.runs, bowler.wickets]);
  }

  async saveBall(matchId: number, over: number, ball: number, result: string) {
    if (this.isWeb) return;

    const insertBall = `
      INSERT INTO balls (match_id, over_number, ball_number, result)
      VALUES (?, ?, ?, ?);
    `;
    await this.db.run(insertBall, [matchId, over, ball, result]);
  }

  async getMatches() {
    if (this.isWeb) return [];

    const query = 'SELECT * FROM matches ORDER BY date_created DESC;';
    const result = await this.db.query(query);
    return result.values || [];
  }

  async getMatchDetails(matchId: number) {
    if (this.isWeb) return { match: null, batters: [], bowlers: [], balls: [] };

    const matchQuery = 'SELECT * FROM matches WHERE id = ?;';
    const battersQuery = 'SELECT * FROM batters WHERE match_id = ?;';
    const bowlersQuery = 'SELECT * FROM bowlers WHERE match_id = ?;';
    const ballsQuery = 'SELECT * FROM balls WHERE match_id = ? ORDER BY over_number, ball_number;';

    const match = await this.db.query(matchQuery, [matchId]);
    const batters = await this.db.query(battersQuery, [matchId]);
    const bowlers = await this.db.query(bowlersQuery, [matchId]);
    const balls = await this.db.query(ballsQuery, [matchId]);

    return {
      match: match.values?.[0],
      batters: batters.values || [],
      bowlers: bowlers.values || [],
      balls: balls.values || []
    };
  }

  async closeConnection() {
    if (this.db && !this.isWeb) {
      await this.sqlite.closeConnection('cricket_scoreboard', false);
    }
  }
}