import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from "../../app/services/theme/theme.service";
import { AppConfig } from '../app.config';
import { SchemaService } from '../services/data/schema.service';
import { GeneralService } from '../services/general/general.service';
import { TelemetryService } from '../services/telemetry/telemetry.service';
import { IInteractEventInput } from '../services/telemetry/telemetry.interface';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Input() headerFor: string = 'default';
  @Input() tab: string;
  @Input() showTitle: boolean = true;
  logo;
  languages: any;
  headerSchema;
  langCode: string;
  lang;
  indexPre;
  ELOCKER_THEME: string;
  entityName: string;
  logoUrl: any;
  apiUrl: any;
  title: string;
  showBanner: boolean = false;
  currentUser: any;

  constructor(
    private readonly config: AppConfig,
    private readonly schemaService: SchemaService,
    private readonly themeService: ThemeService,
    private readonly generalService: GeneralService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly telemetryService: TelemetryService,
    private readonly authService: AuthService
  ) { }

  async ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.languages = JSON.parse(localStorage.getItem('languages'));
    this.langCode = localStorage.getItem('setLanguage');
    this.ELOCKER_THEME = localStorage.getItem('ELOCKER_THEME');


    if (this.headerFor === 'banner') {
      this.showBanner = true;
      return;
    }
    this.entityName = localStorage.getItem('entity');

    if (this.entityName == 'Issuer') {
      await this.getData();
    }

    if (!this.ELOCKER_THEME) {
      localStorage.setItem('ELOCKER_THEME', "default");
    }

    this.logo = this.config.getEnv(localStorage.getItem('ELOCKER_THEME') + '_theme').logoPath;
    this.title = this.config.getConfig('title');
    this.schemaService.getHeaderJSON().subscribe(async (HeaderSchemas) => {
      var filtered = HeaderSchemas.headers.filter(obj => {
        return Object.keys(obj)[0] === this.headerFor;
      });
      this.headerSchema = filtered[0][this.headerFor];

      if (this.headerSchema.hasOwnProperty('left')) {
        this.headerSchema['left'][0]["activeTab"] = (this.headerSchema['left'].length == 1 || (localStorage.getItem('activeTab') == null)) ? 'active' : '';
      }

      if (this.headerSchema.hasOwnProperty('right')) {
        this.headerSchema['right'][0]["activeTab"] = (this.headerSchema['right'].length == 1 || (localStorage.getItem('activeTab') == null)) ? 'active' : '';
      }

      if (localStorage.getItem('activeTab')) {
        let activeT = JSON.parse(localStorage.getItem('activeTab'));
        this.headerSchema[activeT.pos][activeT.i]["activeTab"] = 'active';

        console.log(this.headerSchema);

      }

    }, (error) => {
      console.error('headers.json not found in src/assets/config/ - You can refer to examples folder to create the file')
    });
  }

  async getData() {
    this.generalService.getData('Issuer').subscribe((res) => {
      this.logoUrl = res[0].logoUrl;
    });
  }

  languageChange(lang) {

    if (this.langCode != lang.target.value) {
      lang = lang.target.value;
      localStorage.setItem('setLanguage', lang);
      window.location.reload();
    }
  }

  changeTheme() {
    if (this.ELOCKER_THEME == 'default') {
      this.ELOCKER_THEME = "dark";
    } else {
      this.ELOCKER_THEME = "default";
    }
    this.themeService.setTheme(this.ELOCKER_THEME);
    localStorage.setItem('ELOCKER_THEME', this.ELOCKER_THEME);
  }

  onTabChange(index, pos) {
    localStorage.setItem('activeTab', JSON.stringify({ 'pos': pos, 'i': index }))
  }

  raiseInteractEvent(id: string, type: string = 'CLICK', subtype?: string) {
    const telemetryInteract: IInteractEventInput = {
      context: {
        env: this.activatedRoute.snapshot?.data?.telemetry?.env,
        cdata: []
      },
      edata: {
        id,
        type,
        subtype,
        pageid: this.activatedRoute.snapshot?.data?.telemetry?.pageid,
      }
    };
    this.telemetryService.interact(telemetryInteract);
  }

}

