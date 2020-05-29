import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { userHub } from 'src/app/Shareds/Models/user-hub';
import { UserHubService } from 'src/app/Shareds/Services/user-hub.service';
import { HubMqttService } from 'src/app/Shareds/Services/hub-mqtt.service';
import { ToasterService } from 'src/app/Shareds/Services/toaster.service';
import { hubmqtt } from 'src/app/Shareds/Models/hub.mqtt';
import { AuthService } from 'src/app/Shareds/Core/authentication/auth.service';

@Component({
  selector: 'app-user-hub',
  templateUrl: './user-hub.component.html',
  styleUrls: ['./user-hub.component.css']
})
export class UserHubComponent implements OnInit {
  @Input() zIndex: number = 2031;
  GetAllUserHub:userHub[]
  GetAllAccount:any[]
  gethub: hubmqtt[];
  gettenhub = []
  hub_code
  selectUserHub= new userHub();
  selectUserHub_Hub= new userHub();
  @ViewChild('statusSaveUserHub', {static: false}) statusSaveUserHub: ElementRef;
  @ViewChild('taikhoan', {static: false}) taikhoan: ElementRef;
  @ViewChild('email', {static: false}) email: ElementRef;
  @ViewChild('password', {static: false}) password: ElementRef;
  @ViewChild('buttonRefreshPassWord', {static: false}) buttonRefreshPassWord: ElementRef;
  @ViewChild('ChangeHubCode', {static: false}) ChangeHubCode: ElementRef;
  @ViewChild('PreviousPage_userhub', {static: false}) PreviousPage_userhub: ElementRef;
  @ViewChild('NextPage_userhub', {static: false}) NextPage_userhub: ElementRef;
  @ViewChild('ModelAddUserHub', {static: false}) ModelAddUserHub: ElementRef;
  @ViewChild('TableBoDieuKhien', {static: false}) TableBoDieuKhien: ElementRef;
  @ViewChild('ondeleteUserHub', {static: false}) ondeleteUserHub: ElementRef;
  @ViewChild('ondeleteAccount', {static: false}) ondeleteAccount: ElementRef;
  @ViewChild('deleteAccount', {static: false}) deleteAccount: ElementRef;
  @ViewChild('deleteUserHub', {static: false}) deleteUserHub: ElementRef;
  @ViewChild('onSubBodieukhien', {static: false}) onSubBodieukhien: ElementRef;
  private userid= sessionStorage.getItem('userid')
  private username= sessionStorage.getItem('username')

    // =========================pagding-account=============
    currentPage_account
    pageCount_account
    pageSize_account
    rowCount_account
    firstRowOnPage_account
    lastRowOnPage_account
    //==========================end======================
    formBodieukhien: FormGroup;
  addUser = new FormGroup(
    {
     // Id :new FormControl(),
      username :new FormControl(),
      email:new FormControl(),
      password :new FormControl(),
      note:new FormControl(),
      userid_by :new FormControl(),
      created_by :new FormControl(),
    }
  );
  addCredsBodieukhien() {
    const credentialsBodieukhien = this.formBodieukhien.controls.credentialsBodieukhien as FormArray;
    credentialsBodieukhien.push(this.fb.group({
      userid: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.required],
      hubid: [null,Validators.required],
      hub_code: [null, Validators.required],
      hub_password_client: [null, Validators.required],
      note: [null, Validators.required],
      status: [true, Validators.required],
      userid_by: ['', Validators.required],
      created_by: [null,Validators.required]
    }));
  }
  removeGroupBodieukhien(i){
    const controlBodieukhien = <FormArray>this.formBodieukhien.controls['credentialsBodieukhien'];
    controlBodieukhien.removeAt(i);
  }
  getArrayControlsBodieukhien() {
    return (this.formBodieukhien.get('credentialsBodieukhien') as FormArray).controls;
  }
  constructor(private _userHubService:UserHubService,
    private _serviceHub: HubMqttService, 
    private _toaster: ToasterService,
    private _authService: AuthService,
    private fb: FormBuilder
    ) { 
      this.formBodieukhien = this.fb.group({
        credentialsBodieukhien: this.fb.array([]),
      });
      for (let i = 0; i < 3; i++) {
        this.addCredsBodieukhien();
      }
       
    }

  ngOnInit() {
    this._userHubService.showSpinner.next(true)
    this._toaster.subject.next(null)
    this.getAllAccount()
    this.getAllhub()
  }
  getAlluserhub(userid:string) {
    this._userHubService.GetUserHub(userid).subscribe(data => {
      this.GetAllUserHub = data
    });
  }
  getAllAccount() {
    this._userHubService.GetAccount(null,12,1).subscribe(data => {
      if(data['rowCount']>0)
      {
        this.GetAllAccount = data['results'];
        this.currentPage_account=data['currentPage']
        this.pageCount_account=data['pageCount']
        this.pageSize_account=data['pageSize']
        this.rowCount_account=data['rowCount']
        this.firstRowOnPage_account=data['firstRowOnPage']
        this.lastRowOnPage_account=data['lastRowOnPage']
      }else{
        this.rowCount_account=data['rowCount']
        this.GetAllAccount = data['results'];
      }
     
    });
  }
  getAllhub() {
    this._serviceHub.GetHubMqtt(null,500,1).subscribe(data => {
      this.gethub = data['results'];
      for (let i = 0; i < this.gethub.length; i++) {
        if(this.gethub[i].status==true)
        {
          this.gettenhub.push(this.gethub[i]['code_hub'])
        }
      }
    });
  }
  moveToPreviousPage_account(){
   
    if(this.currentPage_account>1)
    {
      this.PreviousPage_userhub.nativeElement.disabled==false
      this._userHubService.GetAccount(null,12,this.currentPage_account-1).subscribe(data => {
        this.PreviousPage_userhub.nativeElement.disabled==true
        this.GetAllUserHub = data['results'];
        this.currentPage_account=data['currentPage']
        this.pageCount_account=data['pageCount']
        this.pageSize_account=data['pageSize']
        this.rowCount_account=data['rowCount']
        this.firstRowOnPage_account=data['firstRowOnPage']
        this.lastRowOnPage_account=data['lastRowOnPage']
      });
    }
  }
  moveToNextPage_account(){
   
    if(this.currentPage_account+1<=this.pageCount_account)
    {
      this.NextPage_userhub.nativeElement.disabled==false
      this._userHubService.GetAccount(null,12,this.currentPage_account+1).subscribe(data => {
        this.NextPage_userhub.nativeElement.disabled==true
        this.GetAllUserHub = data['results'];
        this.currentPage_account=data['currentPage']
        this.pageCount_account=data['pageCount']
        this.pageSize_account=data['pageSize']
        this.rowCount_account=data['rowCount']
        this.firstRowOnPage_account=data['firstRowOnPage']
        this.lastRowOnPage_account=data['lastRowOnPage']
      });
    }
    
  }
  onEventHubCode(hubid:string){
    
    if(hubid=='null')
    {
         this.addUser.controls['hubid'].reset();
         this.addUser.controls['hub_code'].reset();
         this.addUser.controls['hub_password_client'].reset();
    }else
    {
       this.addUser.controls['hubid'].reset(hubid.split('#')[0].trim());
       this.addUser.controls['hub_code'].reset(hubid.split('#')[1].trim());
       this.addUser.controls['hub_password_client'].reset(hubid.split('#')[2].trim());
    }
  }
  onSubmitUser(){
    this.statusSaveUserHub.nativeElement.disabled =true
    if (this.selectUserHub.edittable==true) 
    {
      let element: HTMLElement = document.getElementById('modalRootClose') as HTMLElement;
      element.click();
    }
    else
    {
     this.addUser.controls['userid_by'].reset(this.userid);
     this.addUser.controls['created_by'].reset(this.username);
     this._userHubService.AddAccount(this.addUser.value).subscribe(data=>{
       this.addUser.reset();
       let element: HTMLElement = document.getElementById('modalRootClose') as HTMLElement;
       element.click();
       this.getAllAccount()
       this._toaster.show('success', 'Thành công!',);
     }); 
    }
  }
  openModalAddUser(){
    this.addUser.reset();
    this.GetAllUserHub=null
    this.TableBoDieuKhien.nativeElement.style.display='none'
    this.ModelAddUserHub.nativeElement.style.display='none'
    //this.ChangeHubCode.nativeElement.value=null
    this.ModelAddUserHub.nativeElement.disabled=true
    this.addUser.controls['password'].reset('Dxmb@123456');
    this.statusSaveUserHub.nativeElement.disabled =false
    this.buttonRefreshPassWord.nativeElement.disabled =true
    this.taikhoan.nativeElement.disabled =false
    this.email.nativeElement.disabled =false
    this.password.nativeElement.disabled =true
    this.selectUserHub=new userHub()
    let element: HTMLElement = document.getElementById('modalRootShow') as HTMLElement;
    element.click();
  }
  refreshPass()
  {
     this._authService.resetpass(this.selectUserHub.userName).subscribe(data=>{
       if(data['status']==1)
       {
        this.addUser.controls['password'].reset('Dxmb@123456');
        this._toaster.show('success', 'Thành công!','Mật Khẩu: Dxmb@123456',10000); 
       }
     })
  }
  modalopenEdit(item:userHub){
    this._userHubService.showSpinnerUserHub.next(true)
    this.selectUserHub=item;
    this.GetAllUserHub=null
    this.getAlluserhub(this.selectUserHub.id)
    this.selectUserHub.edittable=true
    this.TableBoDieuKhien.nativeElement.style.display='block'
    this.ModelAddUserHub.nativeElement.style.display='block'
   // this.ChangeHubCode.nativeElement.value=item.hubid+'#'+item.hub_code+'#'+item.hub_password_client
    this.addUser.controls['username'].reset(item.userName);
    this.addUser.controls['email'].reset(item.email);
    this.addUser.controls['password'].reset();
    this.addUser.controls['note'].reset(item.note);
    this.buttonRefreshPassWord.nativeElement.disabled =false
    this.statusSaveUserHub.nativeElement.disabled =false
    this.taikhoan.nativeElement.disabled =true
    this.email.nativeElement.disabled =true
    this.password.nativeElement.disabled =true
    let element: HTMLElement = document.getElementById('modalRootShow') as HTMLElement;
    element.click();
  }
  openDeleteUser(item:userHub){
    this.selectUserHub=item;
    this.deleteAccount.nativeElement.style.display='initial'
    this.deleteUserHub.nativeElement.style.display='none'
    this.ondeleteUserHub.nativeElement.style.display='none'
    this.ondeleteAccount.nativeElement.style.display='initial'
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
  onDeleteUserHub(id:string)
  {
   // console.log('UserHub')
    if(id)
    {
      this.ondeleteUserHub.nativeElement.disabled=true
      this._userHubService.DeleteUserHub(id).subscribe(data=>{
        this.ondeleteUserHub.nativeElement.disabled=false
        this._userHubService.showSpinnerUserHub.next(true)
        this.getAlluserhub(this.selectUserHub.id)
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      }); 
       
    }
  }
  onDeleteUser(id:string)
  {
    //console.log('User')
    if(id)
    {
      this.ondeleteAccount.nativeElement.disabled=true
      this._userHubService.DeleteAccount(id).subscribe(data=>{
        this.ondeleteAccount.nativeElement.disabled=false
        this.getAllAccount()
        let element: HTMLElement = document.getElementById('modalDeleteHide') as HTMLElement;
        element.click();
      }); 
       
    }
  }
  openModelAddUserHub(){
    this.onSubBodieukhien.nativeElement.disabled=false
    let element: HTMLElement = document.getElementById('childModalBodieukhienShow') as HTMLElement;
    element.click();
  }
  gethubid(tenhubid: string, i)
  {
    if(tenhubid)
    {
      var control = <FormArray>this.formBodieukhien.get('credentialsBodieukhien');
      let selectItemHub = this.gethub.find(x => x.code_hub == tenhubid)
      control.controls[i].get('hubid').setValue(selectItemHub.id);
      control.controls[i].get('hub_code').setValue(selectItemHub.code_hub);
      control.controls[i].get('hub_password_client').setValue(selectItemHub.password_client);
      control.controls[i].get('note').setValue(selectItemHub.room_name);
      control.controls[i].get('status').setValue(true);
    }
    
  }
  onSubmitBodieukhien(){
    let checkNull:boolean=false
    this.onSubBodieukhien.nativeElement.disabled=true
    var control = <FormArray>this.formBodieukhien.get('credentialsBodieukhien');
    for (let i = 0; i < control.length; i++) {
      if( control.controls[i].get('hub_code').value!=null)
      {
         checkNull=true
         control.controls[i].get('userid').setValue(this.selectUserHub.id)
         control.controls[i].get('username').setValue(this.selectUserHub.userName)
         control.controls[i].get('email').setValue(this.selectUserHub.email)
         control.controls[i].get('userid_by').setValue(this.userid)
         control.controls[i].get('created_by').setValue(this.username)
      }
    }
    if(checkNull==true)
    {
      var df = JSON.stringify(this.formBodieukhien.value);
      var json: any[] = JSON.parse(df);
      let arrray_userhub=[]
        for(let i=0;i<Object.values(json)[0].length;i++)
        {
            if(Object.values(json)[0][i]['hub_code'])
            {
              arrray_userhub.push(Object.values(json)[0][i])
            }
        }
      this._userHubService.AddUserHub(arrray_userhub).subscribe(data=>{
        this._userHubService.showSpinnerUserHub.next(true)
        this.getAlluserhub(this.selectUserHub.id)
        let element: HTMLElement = document.getElementById('childModalBodieukhienClose') as HTMLElement;
        element.click();
        this.formBodieukhien.reset();
        for (let i = control.length; 0 <= i; i--) {
          control.removeAt(i)
        }
        for (let i = 0; i < 3; i++) {
          this.addCredsBodieukhien();
        }
      })

    }
    else{
      this._toaster.show('error', 'Thất Bại!', 'Cần nhập đầy đủ thông tin.');
    }
  }
  openDeleteUserHub(item:userHub){
   this.deleteAccount.nativeElement.style.display='none'
   this.deleteUserHub.nativeElement.style.display='initial'
   this.ondeleteUserHub.nativeElement.style.display='initial'
   this.ondeleteAccount.nativeElement.style.display='none'
    this.selectUserHub_Hub=item;
    let element: HTMLElement = document.getElementById('modalDelete') as HTMLElement;
    element.click();
  }
}
