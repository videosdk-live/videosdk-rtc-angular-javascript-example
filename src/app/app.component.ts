import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { VideoSDK } from '@videosdk.live/js-sdk'; 
import { environment } from './../environments/environment';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;
  @ViewChild('remoteAudio') remoteAudio: ElementRef;
  title = 'videosdk-rtc-angular-javascript-example';
  meeting: any;

  constructor() {}


  async initMeeting() {
    VideoSDK.config(environment.token);

    this.meeting = VideoSDK.initMeeting({
      meetingId: environment.meetingId, // required
      name: "Arjun", // required
      micEnabled: true, // optional, default: true
      webcamEnabled: true, // optional, default: true
      maxResolution: "hd", // optional, default: "hd"
    })   
    this.registerParticipantEvents();
  }

  join(){
    this.meeting.join();
  }

  leave(){
    this.meeting.leave();
  }

  registerParticipantEvents(){
    this.meeting.on("meeting-joined", () => {
      this.meeting.localParticipant.on("stream-enabled", (stream: any) => {
        if(stream.kind == "video") this.createVideoElement(stream, this.meeting.localParticipant, this.localVideo);
      })
    }) 
    this.meeting.on("participant-joined", (participant: any) => {
      participant.on("stream-enabled", (stream: any) => {
        if(stream.kind == "audio") this.createAudioElement(stream, participant, this.remoteAudio);
        if(stream.kind == "video") this.createVideoElement(stream, participant, this.remoteVideo);
      })
    })
  }

  createAudioElement(stream: any, participant: any, remoteAudio: ElementRef){
    if (participant.id == this.meeting.localParticipant.id) return;
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    remoteAudio.nativeElement.srcObject = mediaStream;
  }

  createVideoElement(stream: any, participant: any, remoteVideo: ElementRef){
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    remoteVideo.nativeElement.srcObject = mediaStream;
  }

  ngOnInit(){
    this.initMeeting();
  }

  getKeys(map: any){
    return Array.from(map.keys()); 
  }

  enableMic(){
    this.meeting.localParticipant.enableMic();
  }

  disableMic(){
    this.meeting.localParticipant.disableMic();
  }

  enableCam(){
    this.meeting.localParticipant.enableWebcam();
  }

  disableCam(){
    this.meeting.localParticipant.disableWebcam();
  }

  
}
