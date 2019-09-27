import { TestBed, ComponentFixture, fakeAsync, flush, async } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA, Directive, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";


describe('HeroDetailComponent', () => {
    let HEROES;
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockHeroService: jasmine.SpyObj<HeroService>;
    let mockActivatedRoute, mockLocation: Location;

    beforeEach( () => {

        mockActivatedRoute = {
            snapshot: {
                paramMap: { get: () => { return '3' } }
            }
        }

        mockHeroService = jasmine.createSpyObj(['getHero', 'save']);
        mockLocation = jasmine.createSpyObj(['back']);

        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 55 },
            { id: 3, name: 'SuperDude', strength: 24 }
        ];

        TestBed.configureTestingModule({
            imports: [ FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Location, useValue: mockLocation },
            ]
        });

        fixture = TestBed.createComponent(HeroDetailComponent);
    });

    it('should render hero name in a h2 tag', () => {
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 24 }));
        fixture.detectChanges();

        const h2DebugElement = fixture.debugElement.query(By.css('h2')).nativeElement.contextContent;
        const h2NativeElement = fixture.nativeElement.querySelector('h2').textContent;
        
        expect(h2NativeElement).toContain( HEROES[2].name.toUpperCase() );

    });

    it("should call save method when button save is called syncronous", () => {
        spyOn(fixture.componentInstance, 'save');
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 24 }));
        fixture.detectChanges();

        const saveButton = fixture.debugElement.queryAll(By.css('button'))[1];
        saveButton.triggerEventHandler('click', null);
        
        expect(fixture.componentInstance.save).toHaveBeenCalled();   
    });

    it("should call save method when button save is called with fakeAsync()", fakeAsync(() => {
        spyOn(fixture.componentInstance, 'save');
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 24 }));
        fixture.detectChanges();

        // async with zone.js

        fixture.componentInstance.save();
        flush();
        
        expect(fixture.componentInstance.save).toHaveBeenCalled();   
    }));

    it("should call save method when button save is called with async()", async(() => {
        spyOn(fixture.componentInstance, 'save');
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 24 }));
        fixture.detectChanges();
        
        fixture.componentInstance.save();

        fixture.whenStable().then( () => {
            expect(fixture.componentInstance.save).toHaveBeenCalled();   
        });

    }));

    it('should call goBack method when button go back is clicked', () => {
        spyOn(fixture.componentInstance, 'goBack');
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 24 }));
        fixture.detectChanges();

        const backButton = fixture.debugElement.queryAll(By.css('button'))[0];
        backButton.triggerEventHandler('click', null);

        expect(fixture.componentInstance.goBack).toHaveBeenCalled();
    });
});