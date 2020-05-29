import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Toast } from '../Models/toast.interface';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() toast: Toast;
  @Input() i: number;

  @Output() remove = new EventEmitter<number>();
}
