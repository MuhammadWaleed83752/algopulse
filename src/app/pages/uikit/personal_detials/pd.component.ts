import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { CITIES, GENDER, COUNTRY_LIST, CIVIL_STATUS_OPTIONS } from '../../../../assets/data/dropdown-options';
import { PersonalDetails } from '../../../models/personal_details';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
    // selector: 'app-map',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, DropdownModule, InputMaskModule, CommonModule, TranslateModule],
    templateUrl: 'pd.component.html',
    styleUrls: ['./pd.component.css'],
    providers: [],
})
export class PersonalDetailsComponent {

    constructor(private translate: TranslateService) {
        translate.setDefaultLang('en');  // optional, already in main.ts
    }

    currentLang = 'en';
    personalDetails: PersonalDetails = {
        firstName: '',
        lastName: '',
        middleName: '',
        employer: '',
        jobTitle: '',
        address: '',
        mobileNumber: '',
        selectedGender: null,
        selectedCivilStatus: null,
        selectedCountry: null,
        selectedCity: null,
    };

    gender = GENDER;
    civilStatus = CIVIL_STATUS_OPTIONS;
    countries = COUNTRY_LIST;
    cities = CITIES;

    onSubmit(form: any) {
        if (form.valid) {
            console.log('Form Submitted', this.personalDetails);
        } else {
            console.log('Form Invalid');
        }
    }

    toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
  }
}