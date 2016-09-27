import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';
import { MainComponent } from './main.component';

export let MainModule = @NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    TooltipModule,
  ],
  declarations: [MainComponent]
})
class MainModule {};
