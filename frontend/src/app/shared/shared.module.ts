import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ErrorComponent } from './components/error/error.component';
import { FollowButtonComponent } from './components/follow-button/follow-button.component';
import { InfoComponent } from './components/info/info.component';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ErrorComponent,
    FollowButtonComponent,
    InfoComponent,
    LoadingComponent,
  ],
  exports: [  // Re-Export
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // Components
    ErrorComponent,
    FollowButtonComponent,
    InfoComponent,
    LoadingComponent,
  ]
})
export class SharedModule { }
