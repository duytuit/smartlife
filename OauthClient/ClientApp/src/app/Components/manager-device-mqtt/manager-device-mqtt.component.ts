import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HubMqttService } from 'src/app/Shareds/Services/hub-mqtt.service';
import { hubmqtt } from 'src/app/Shareds/Models/hub.mqtt';
import { ToasterService } from 'src/app/Shareds/Services/toaster.service';
import { DeviceMqttService } from 'src/app/Shareds/Services/device-mqtt.service';
import { MqttSocketService } from 'src/app/Shareds/Services/mqtt-socket.service';
import { devicemqtt } from 'src/app/Shareds/Models/device.mqtt';
import { AuthService } from 'src/app/Shareds/Core/authentication/auth.service';

@Component({
  selector: 'app-manager-device-mqtt',
  templateUrl: './manager-device-mqtt.component.html',
  styleUrls: ['./manager-device-mqtt.component.css']
})
export class ManagerDeviceMqttComponent implements OnInit {
  @Input() zIndex: number = 2031;
  gethub: hubmqtt[];
  getdevice: devicemqtt[];
  GetBranchHub: hubmqtt[];
  GetBranchDevice: devicemqtt[];
  GetAllSwitch:any[]=[] // mảng lưu tất cả các trạng thái switch
  messages: string[] = [];
  @ViewChild('buttonRefresh', {static: false}) buttonRefresh: ElementRef;
  @ViewChild('ChangeHubCode', {static: false}) ChangeHubCode: ElementRef;
  @ViewChild('statusSaveDevice', {static: false}) statusSaveDevice: ElementRef;
  @ViewChild('statusSaveHub', {static: false}) statusSaveHub: ElementRef;
  @ViewChild('PreviousPage_hub', {static: false}) PreviousPage_hub: ElementRef;
  @ViewChild('NextPage_hub', {static: false}) NextPage_hub: ElementRef;
  @ViewChild('PreviousPage_device', {static: false}) PreviousPage_device: ElementRef;
  @ViewChild('NextPage_device', {static: false}) NextPage_device: ElementRef;
  @ViewChild('onDeletehub', {static: false}) onDeletehub: ElementRef;
  @ViewChild('onDeletebevice', {static: false}) onDeletebevice: ElementRef;
  private userid= sessionStorage.getItem('userid')
  private username= sessionStorage.getItem('username')
  CheckDelete:boolean=false
  selecthub= new hubmqtt()
  selectdevice= new devicemqtt()
  subcribe // biến lưu messager phản hồi Serve Mqtt;
  hub_code // biến lưu bộ điều khiển trung tâm
  code_device // biến lưu ID thiết bị
  count_device_type // biến lưu số switch
  array_sub=[]      // biến test 
  count_sub:number   // biến test 
  modalTitleDevice //tiêu đề khi bật modal xem trạng thái công tắc thiết bị
  selectItemHub // biến lưu  id hub khi chọn  
  selectItem 
  // =========================pagding-hub=============
  currentPage_hub
  pageCount_hub
  pageSize_hub
  rowCount_hub
  firstRowOnPage_hub
  lastRowOnPage_hub
  //==========================end======================
  // =========================pagding-device=============
  currentPage_device
  pageCount_device
  pageSize_device
  rowCount_device
  firstRowOnPage_device
  lastRowOnPage_device
  //==========================end======================


  addHub = new FormGroup(
    {
     // Id :new FormControl(),
     code_hub :new FormControl(),
     room_name :new FormControl(),
     roomid :new FormControl(),
     password_client :new FormControl(),
     note :new FormControl(),
     status:new FormControl(),
     userid_by:new FormControl(),
     created_by:new FormControl()
    }
  );
  addDevice = new FormGroup(
    {
     // Id :new FormControl(),
      name_device :new FormControl(),
      code_device :new FormControl(),
      device_type :new FormControl(),
      number_switch :new FormControl(),
      hubid :new FormControl(),
      hub_code:new FormControl(),
      hub_password_client:new FormControl(),
      hub_room_name:new FormControl(),
      icon:new FormControl(),
      note:new FormControl(),
      status :new FormControl(true),
      userid_by :new FormControl(),
      created_by :new FormControl(),
      status_device:new FormControl(),
    }
  );
  constructor(
   // private authService: AuthService,
    private serviceHub: HubMqttService, 
    private toaster: ToasterService,
    private deviceMqttService:DeviceMqttService,
    private mqttSocketService:MqttSocketService,
    private renderer: Renderer2
    ) {
      this.mqttSocketService.announcement$.subscribe(announcement => {
        if (announcement) {
          this.messages.unshift(announcement);
        }
      });
    
      this.mqttSocketService.subcribe$.subscribe(sq => {
           this.GetAllSwitch=[]
           this.count_sub= this.array_sub.push(sq['Payload'])
          // if(this.count_sub===1||this.count_sub===2)
          // {
                 this.subcribe=sq['Payload']
                 let TopicMess=sq['Topic_result']
                  if(this.subcribe != undefined)
                    {
                        // phản hồi messager new_device
                      if(this.hub_code===this.subcribe.split('/')[0].trim())
                      {
                        this.addDevice.controls['code_device'].reset(this.subcribe.split('/')[1].trim());
                        this.addDevice.controls['device_type'].reset(this.subcribe.split('/')[2].trim());
                      }
                      // phản hồi messager stt_device_sv
                      if(TopicMess==='stt_device_sv'&&this.hub_code==this.subcribe.split('/')[0].trim())
                      {
                         for(let x=0;x<this.subcribe.split('/')[2].length;x++)
                         {
                              let arr =
                                {
                                  "Status": this.subcribe.split('/')[2][x]
                                }
                                this.GetAllSwitch.push(arr)
                         }
                        //this.subcribe.split('/')[2].length
                        //console.log(this.GetAllSwitch)
                      }
                    }
         // }
       // console.log(this.subcribe)
      });
  }

  ngOnInit() {
   this.deviceMqttService.showSpinner.next(true)
    this.mqttSocketService.startSocket();
    this.toaster.subject.next(null)
    this.getAllhub();
  }
  getAllhub() {
    this.serviceHub.GetHubMqtt(null,5,1).subscribe(data => {
      this.selectItem = 0;
      this.selectItemHub=data['results'][0]['id']
      this.getAllDevice(data['results'][0]['id'])
      this.gethub = data['results'];
      this.currentPage_hub=data['currentPage']
      this.pageCount_hub=data['pageCount']
      this.pageSize_hub=data['pageSize']
      this.firstRowOnPage_hub=data['firstRowOnPage']
      this.lastRowOnPage_hub=data['lastRowOnPage']
      // console.log(this.gethub)
    });
  }
  moveToPreviousPage_hub()
  {
  
    if(this.currentPage_hub>1)
    {
      this.PreviousPage_hub.nativeElement.disabled=true
      this.serviceHub.GetHubMqtt(null,5,this.currentPage_hub-1).subscribe(data => {
        this.PreviousPage_hub.nativeElement.disabled=false
        this.gethub = data['results'];
        this.currentPage_hub=data['currentPage']
        this.pageCount_hub=data['pageCount']
        this.pageSize_hub=data['pageSize']
        this.firstRowOnPage_hub=data['firstRowOnPage']
        this.lastRowOnPage_hub=data['lastRowOnPage']
        // console.log(this.gethub)
      }); 
    }
  
  }
  moveToNextPage_hub(){
 
    if(this.currentPage_hub+1<=this.pageCount_hub)
    {
      this.NextPage_hub.nativeElement.disabled=true
      this.serviceHub.GetHubMqtt(null,5,this.currentPage_hub+1).subscribe(data => {
        this.NextPage_hub.nativeElement.disabled=false
        this.gethub = data['results'];
        this.currentPage_hub=data['currentPage']
        this.pageCount_hub=data['pageCount']
        this.pageSize_hub=data['pageSize']
        this.firstRowOnPage_hub=data['firstRowOnPage']
        this.lastRowOnPage_hub=data['lastRowOnPage']
        // console.log(this.gethub)
      }); 
    }
    
  
  }
  onSubmitHub(){
    this.statusSaveHub.nativeElement.disabled =true
     if (this.selecthub.edittable==true) 
     {
      this.selecthub.code_hub=this.addHub.controls['code_hub'].value;
      this.selecthub.roomid=this.addHub.controls['roomid'].value;
      this.selecthub.room_name=this.addHub.controls['room_name'].value;
      this.selecthub.note=this.addHub.controls['note'].value;
      this.selecthub.status=this.addHub.controls['status'].value;
      this.selecthub.userid_by=this.addHub.controls['userid_by'].value;
      this.selecthub.created_by=this.addHub.controls['created_by'].value;
      this.selecthub.userid_by=this.userid
      this.selecthub.created_by=this.username
      this.serviceHub.UpdateHubMqtt(this.selecthub).subscribe(data=>{
        this.addHub.reset();
        this.close();
        this.getAllhub()
      }); 
     }
     else
     {
      this.addHub.controls['roomid'].reset('1a3b944e-3632-467b-a53a-206305310bae');
      this.addHub.controls['userid_by'].reset(this.userid);
      this.addHub.controls['created_by'].reset(this.username);
      this.serviceHub.AddHubMqtt(this.addHub.value).subscribe(data=>{
        this.addHub.reset();
        this.close();
        this.getAllhub()
        this.toaster.show('success', 'Thành công!',);
      }); 
     }
  
  }
  openmodaladdHub(){
    this.addHub.reset();
    this.buttonRefresh.nativeElement.disabled =false
    this.statusSaveHub.nativeElement.disabled =false
    this.selecthub=new hubmqtt()
    let element: HTMLElement = document.getElementById('modalRootShow') as HTMLElement;
    element.click();
  }
  onEventHubCode(hubid:string){
    
    if(hubid=='null')
    {
         this.addDevice.controls['hubid'].reset();
         this.addDevice.controls['hub_code'].reset();
         this.addDevice.controls['hub_password_client'].reset();
         this.addDevice.controls['hub_room_name'].reset();
         this.hub_code=null
    }else
    {
       this.addDevice.controls['hubid'].reset(hubid.split('#')[0].trim());
       this.addDevice.controls['hub_code'].reset(hubid.split('#')[1].trim());
       this.addDevice.controls['hub_password_client'].reset(hubid.split('#')[2].trim());
       this.addDevice.controls['hub_room_name'].reset(hubid.split('#')[3].trim());
       this.AdDeviceWithServerMqtt(this.addDevice.controls['hub_code'].value)
       this.hub_code=hubid.split('#')[1].trim()
    }
  }
  onMouseEnter(item: hubmqtt) {
    for (let i = 0; i < this.gethub.length; i++) {
      if (this.gethub[i].edittable == true) {
        this.gethub[i].edittable = false
      }
    }
    item.edittable = true;
  }
  onMouseEnterDevice(item: devicemqtt) {
    if(this.getdevice)
    {
      for (let i = 0; i < this.getdevice.length; i++) {
        if (this.getdevice[i].edittable == true) {
          this.getdevice[i].edittable = false
        }
      }
      item.edittable = true;
    }
  }
  onMouseEnterClose() {
      if(this.getdevice)
      {
        for (let i = 0; i < this.getdevice.length; i++) {
          if (this.getdevice[i].edittable == true) {
            this.getdevice[i].edittable = false
          }
        }
      }
     if(this.gethub)
     {
      for (let i = 0; i < this.gethub.length; i++) {
        if (this.gethub[i].edittable == true) {
          this.gethub[i].edittable = false
        }
      }
     }
     
  }
  close(){
    let element: HTMLElement = document.getElementById('modalRootClose') as HTMLElement;
    element.click();
}
  refresh(){
    this.addHub.reset();
  }
  openEdit(item: hubmqtt)
  {
    this.statusSaveHub.nativeElement.disabled =false
    this.selecthub=item
    this.selecthub.edittable=true
    this.addHub.controls['code_hub'].reset(item.code_hub);
    this.addHub.controls['password_client'].reset(item.password_client);
    this.addHub.controls['roomid'].reset(item.roomid);
    this.addHub.controls['room_name'].reset(item.room_name);
    this.addHub.controls['note'].reset(item.note);
    this.addHub.controls['status'].reset(item.status);
    this.addHub.controls['userid_by'].reset(item.userid_by);
    this.addHub.controls['created_by'].reset(item.created_by);
    this.buttonRefresh.nativeElement.disabled =true
      let element: HTMLElement = document.getElementById('modalRootShow') as HTMLElement;
      element.click();
  }
  openDelete(item){
    this.CheckDelete=false
    this.selectdevice=new devicemqtt()
    this.selecthub=item;
    this.onDeletehub.nativeElement.disabled=false
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
  onDeleteHub(id:string){
    if(id)
    {
      this.onDeletehub.nativeElement.disabled=true
      this.serviceHub.DeleteHubMqtt(id).subscribe(data=>{
        this.getAllhub()
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      }); 
       
    }
  }
  Publisher(TopicPublished,MessagerTopicPublished){
  
    if(TopicPublished&&MessagerTopicPublished)
    {
     let req = [
       {
         "Name":'Publisher',
         "Topic": TopicPublished,
         "Messager": MessagerTopicPublished
       }
     ];
     this.mqttSocketService.sendMqttRequest(req);
    }
   }
   Subcriber(TopicSubcribed){
     if(TopicSubcribed)
     {
      let req = [
        {
          "Name":'Subcriber',
          "Topic": TopicSubcribed,
          "Messager": null
        }
      ];
      this.mqttSocketService.sendMqttRequest(req);
     }
   }
  // @HostListener('document:mouseup', ['$event'])
  // onMouseUp(event) {
  //   for (let i = 0; i < this.gethub.length; i++) {
  //     if (this.gethub[i].edittable == true) {
  //       this.gethub[i].edittable = false
  //     }
  //   }
  // }
  AdDeviceWithServerMqtt(Hub:string)
  {
       this.addDevice.controls['code_device'].reset();
       this.addDevice.controls['device_type'].reset();
       let Mode_Topic=Hub+'/mode';
       let Mode_Topic_find=Hub+'/find_device';
       let Mode_Topic_comfirm=Hub+'/comfirm';
       let Mode_Mess_1=1;//chế độ chạy bình thường
       let Mode_Mess_2=2;//chế độ cài đặt
      //  this.Publisher(Mode_Topic,Mode_Mess_2);
      //  this.Subcriber('mode_sv')
      //  this.mqttSocketService.subcribe$.subscribe(sq => {
      //   this.subcribe=sq;
      // });
      //let json_mode: any[] = JSON.parse(this.subcribe);
      //  if(json_mode['Payload'].split('/')[1].trim()==2)
      //  {
         this.toaster.show('success', 'Chế Độ Thêm Thêm Thiết Bị!','Thành Công');
         this.Publisher(Mode_Topic,Mode_Mess_2);
         this.Publisher(Mode_Topic_find,Mode_Mess_1);
       
         this.Subcriber('new_device')
        //  this.mqttSocketService.subcribe$.subscribe(sq => {
        //   this.subcribe=sq;
        // });
      // let json_new_device: any[] = JSON.parse(this.subcribe);
      //  console.log(json_new_device)
        // this.addDevice.controls['code_device'].reset(this.subcribe.split('/')[1].trim());
        // this.addDevice.controls['device_type'].reset(this.subcribe.split('/')[2].trim());
        //console.log(this.subcribe)
       //}
      //  console.log(json['Payload'])
      //  this.subcribe.p
  }
  refreshDevice(){
    //this.AdDeviceWithServerMqtt(this.hub_code)
    // this.addDevice.reset()
    // this.ChangeHubCode.nativeElement.value=null
  }
  onSubmitDevice(){
    this.statusSaveDevice.nativeElement.disabled=true;
    if (this.selectdevice.edittable==true) 
    {
      this.selectdevice.name_device= this.addDevice.controls['name_device'].value;
      this.selectdevice.icon= this.addDevice.controls['icon'].value;
      this.selectdevice.note= this.addDevice.controls['note'].value;
      this.selectdevice.status= this.addDevice.controls['status'].value;
      this.selectdevice.userid_by=this.userid
      this.selectdevice.created_by=this.username
      this.deviceMqttService.UpdateDeviceMqtt(this.selectdevice).subscribe(data=>{
       // this.getAllDevice()
        this.toaster.show('success', 'Sửa Thiết Bị!','Thành Công');
        let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
        element.click();
      }); 
    }else{
      this.addDevice.controls['userid_by'].reset(this.userid);
      this.addDevice.controls['created_by'].reset(this.username);
      this.deviceMqttService.AddDeviceMqtt(this.addDevice.value).subscribe(data=>{
        this.addDevice.reset();
      //  this.getAllDevice()
        this.toaster.show('success', 'Thêm Thiết Bị!','Thành Công');
        let element: HTMLElement = document.getElementById('modalDeviceClose') as HTMLElement;
        element.click();
      }); 
    }
  }
  getAllDevice(hubid:string)
  {
    if(hubid!=null)
    {
      this.deviceMqttService.GetDeviceMqtt(hubid,12,1).subscribe(data=>{
      
        if(data['rowCount']>0)
        {
          this.getdevice=data['results']
          this.currentPage_device=data['currentPage']
          this.pageCount_device=data['pageCount']
          this.pageSize_device=data['pageSize']
          this.rowCount_device=data['rowCount']
          this.firstRowOnPage_device=data['firstRowOnPage']
          this.lastRowOnPage_device=data['lastRowOnPage']
        }
        else
        {
          this.getdevice=data['results']
          this.rowCount_device=data['rowCount']
        }
       
       // console.log(this.getdevice)
    })
    }else{
      this.deviceMqttService.GetDeviceMqtt(null,12,1).subscribe(data=>{
        this.getdevice=data['results']
        this.currentPage_device=data['currentPage']
        this.pageCount_device=data['pageCount']
        this.pageSize_device=data['pageSize']
        this.rowCount_device=data['rowCount']
        this.firstRowOnPage_device=data['firstRowOnPage']
        this.lastRowOnPage_device=data['lastRowOnPage']
       // console.log(this.getdevice)
    })
    }
   
  }
  moveToPreviousPage_device(){
    if(this.currentPage_device>1)
    {
      this.PreviousPage_device.nativeElement.disabled==false
      this.deviceMqttService.GetDeviceMqtt(this.selectItemHub,12,this.currentPage_device-1).subscribe(data=>{
        this.PreviousPage_device.nativeElement.disabled==true
        this.getdevice=data['results']
        this.currentPage_device=data['currentPage']
        this.pageCount_device=data['pageCount']
        this.pageSize_device=data['pageSize']
        this.rowCount_device=data['rowCount']
        this.firstRowOnPage_device=data['firstRowOnPage']
        this.lastRowOnPage_device=data['lastRowOnPage']
       // console.log(this.getdevice)
    })
    }
  }
  moveToNextPage_device(){
    if(this.currentPage_device+1<=this.pageCount_device)
    {
      this.NextPage_device.nativeElement.disabled==false
      this.deviceMqttService.GetDeviceMqtt(this.selectItemHub,12,this.currentPage_device+1).subscribe(data=>{
        this.NextPage_device.nativeElement.disabled==true
        this.getdevice=data['results']
        this.currentPage_device=data['currentPage']
        this.pageCount_device=data['pageCount']
        this.pageSize_device=data['pageSize']
        this.rowCount_device=data['rowCount']
        this.firstRowOnPage_device=data['firstRowOnPage']
        this.lastRowOnPage_device=data['lastRowOnPage']
       // console.log(this.getdevice)
    })
    }
  }
  getColor(z):string {
   
    if (this.selectItem === z) {
      return '#a9a9a9a6';
    }
   
  }
  GetValueItemHub(item:hubmqtt,z){
      this.selectItemHub=item.id
      this.selectItem = z;
     this.deviceMqttService.showSpinnerTable.next(true)
      this.getAllDevice(this.selectItemHub)
  }
  openDeleteDevice(item: devicemqtt){
    this.CheckDelete=true
    this.selectdevice=item
    this.onDeletebevice.nativeElement.disabled=false
    this.selecthub=new hubmqtt();
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
  onDeleteDevice(id:string)
  {
    if(id)
    {
      this.onDeletebevice.nativeElement.disabled=true

      this.deviceMqttService.DeleteDeviceMqtt(id).subscribe(data=>{
     this.deviceMqttService.showSpinnerTable.next(true)
        this.getAllDevice(this.selectItemHub)
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      }); 
       
    }
  }
  openEditDevice(item: devicemqtt){
    this.statusSaveDevice.nativeElement.disabled=false;
    this.selectdevice=item;
    this.selectdevice.edittable=true
    this.ChangeHubCode.nativeElement.disabled=true;
    this.ChangeHubCode.nativeElement.value=item.hubid+'#'+item.hub_code+'#'+item.hub_password_client+'#'+item.hub_room_name
    this.addDevice.controls['name_device'].reset(item.name_device);
    this.addDevice.controls['code_device'].reset(item.code_device);
    this.addDevice.controls['device_type'].reset(item.device_type);
    this.addDevice.controls['number_switch'].reset(item.number_switch);
    this.addDevice.controls['hubid'].reset(item.hubid);
    this.addDevice.controls['hub_password_client'].reset(item.hub_password_client);
    this.addDevice.controls['hub_room_name'].reset(item.hub_room_name);
    this.addDevice.controls['hub_code'].reset(item.hub_code);
    this.addDevice.controls['icon'].reset(item.icon);
    this.addDevice.controls['note'].reset(item.note);
    this.addDevice.controls['status'].reset(item.status);
    this.addDevice.controls['userid_by'].reset(item.userid_by);
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
  openmodaladdDevice()
  {
    this.statusSaveDevice.nativeElement.disabled=false;
    this.ChangeHubCode.nativeElement.value=null;
    this.addDevice.reset()
    this.ChangeHubCode.nativeElement.disabled=false;
    this.selectdevice = new devicemqtt()
   // this.addHub.reset();
    let element: HTMLElement = document.getElementById('modalDeviceShow') as HTMLElement;
    element.click();
  }
  OpenRemote(item: devicemqtt){
    this.modalTitleDevice=item.name_device
    this.count_sub=0
    this.GetAllSwitch=[]
    this.array_sub=[]
    this.hub_code=item.hub_code
    this.count_device_type=item.device_type
    let GetStt_Topic=item.hub_code+'/get_stt';
    let IdDevice_Mess=item.code_device;
    let Stt_device_sv_Topic='stt_device_sv';
    this.code_device=item.code_device;
    this.Publisher(GetStt_Topic,IdDevice_Mess);
    this.Subcriber(Stt_device_sv_Topic)
    let element: HTMLElement = document.getElementById('modalRemoteShow') as HTMLElement;
    element.click();
  }
  refreshStatusDevice()
  {
    
    this.count_sub=0
    this.array_sub=[]
    this.GetAllSwitch=[]
    let GetStt_Topic=this.hub_code+'/get_stt';
    let IdDevice_Mess= this.code_device
    let Stt_device_sv_Topic='stt_device_sv';
    this.Subcriber(Stt_device_sv_Topic)
    this.Publisher(GetStt_Topic,IdDevice_Mess);
   
  }
  ChangeStatusSwitch(item,i){
    var el: HTMLElement = document.getElementById('status-'+i);
    var eltext: HTMLElement = document.getElementById('text-'+i);
    //debugger
    if(item['Status']==0)
    {
      el.style.left="43px";
      eltext.style.backgroundColor="#3dbf87";
    }
    if(item['Status']==1)
    {
      el.style.left="5px";
      eltext.style.backgroundColor="#fc3164";
    }
  }
}
