import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-hub',
  templateUrl: './filter-hub.component.html',
  styleUrls: ['./filter-hub.component.css']
})
export class FilterHubComponent implements OnInit {
  @Input() dataSet: any;
  @Input() searchText: string;  
  @Input() placeholderText: string;  
  @Input() maxLen: number;
  @Output() typeahead: EventEmitter<any> = new EventEmitter();
  filterSet: any;
  isVisible: boolean;
  isCursorOverFilterSet: boolean;
  isArryDataSet: boolean; 
  ChkValue:boolean=false;
  constructor() { 
    this.dataSet = this.dataSet || [];
    this.searchText = this.searchText || '';
    this.maxLen = this.maxLen || 5;
    this.filterSet = [];
    this.isVisible = false;

  }
  
  ngOnInit() {
  }
  onSearch(event: any) {  
    if(this.searchText)
    {
      if(this.searchText.length > 0) {
        this.filterSet = this.dataSet.filter((item) => {        
            return item
                  .toLowerCase()
                  .indexOf(this.searchText.toLowerCase()) > -1        
        });
    if( this.filterSet)
    {
      this.filterSet = this.filterSet.slice(0, this.maxLen);
    }
        this.showList();
        this.ChkValue=true;
      } else {
        this.filterSet = [];
      } 
    }
  }
  hideList() {
    if(this.isCursorOverFilterSet != true) {
      this.isVisible = false;
    }    
  }

  showList() {
      if(this.searchText.length > 0){
        this.isVisible = true;
      }
  }

  cursorOverSet() {
   // this.showList();
    this.isCursorOverFilterSet = true;
  }

  setValue(value: any) {
    this.searchText = value;
    this.filterSet = [];    
    this.filterSet.push(value);
    this.isCursorOverFilterSet = false;
    this.hideList();
    this.typeahead.emit(this.searchText);
  }
  save(event: any){
    this.searchText=this.filterSet[0];
    this.filterSet = [];
   // this.isVisible = false;
    this.isCursorOverFilterSet = false;
    this.typeahead.emit(this.searchText);
  }
  ClearText(){
    if(this.ChkValue==true){
      this.searchText=null
      this.typeahead.emit(null);
      this.ChkValue=false;
    }
  }
}
