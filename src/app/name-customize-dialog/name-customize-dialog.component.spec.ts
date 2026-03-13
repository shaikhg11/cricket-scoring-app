import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCustomizeDialogComponent } from './name-customize-dialog.component';

describe('NameCustomizeDialogComponent', () => {
  let component: NameCustomizeDialogComponent;
  let fixture: ComponentFixture<NameCustomizeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameCustomizeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameCustomizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
