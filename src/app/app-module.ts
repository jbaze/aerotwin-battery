import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MainLayout } from './layouts/main-layout/main-layout';

@NgModule({
  declarations: [
    App,
    MainLayout
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
