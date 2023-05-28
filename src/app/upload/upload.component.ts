import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  selectedFile!: File;
  recording = false;
  timer = 0;
  uploading = false;
  uploadProgress = 0;
  errorMessage = '';

  private trigger: Subject<void> = new Subject<void>();

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File | null = (target.files as FileList)[0] || null;
    if (file) {
      this.selectedFile = file;
    }
  }

  startRecording(): void {
    this.recording = true;
    this.timer = 0;
    this.record();
  }

  stopRecording(): void {
    this.recording = false;
    clearInterval(this.timer);
  }

  flipCamera(): void {
    this.trigger.next();
  }

  record(): void {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((stream) => {
        this.videoPlayer.nativeElement.srcObject = stream;
        this.videoPlayer.nativeElement.play();
        this.timer = setInterval(() => {
          if (this.videoPlayer.nativeElement.duration >= 30) {
            this.stopRecording();
          }
        }, 1000);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.uploading = true;
      this.uploadProgress = 0;
      // Implement the upload logic to your backend
      // You can use the selectedFile to upload the video file
      // Show upload progress using appropriate API or library
    } else {
      this.errorMessage = 'Please select a file to upload.';
    }
  }
}
