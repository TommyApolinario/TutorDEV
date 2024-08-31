import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoProfileComponent } from './upload-photo-profile.component';

describe('UploadPhotoProfileComponent', () => {
  let component: UploadPhotoProfileComponent;
  let fixture: ComponentFixture<UploadPhotoProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPhotoProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadPhotoProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
