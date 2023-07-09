import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './components/error/error.component';
import { InfoComponent } from './components/info/info.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    ErrorComponent,
    InfoComponent,
    LoadingComponent
  ],
  exports: [  // Re-Export
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    ErrorComponent,
    InfoComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
