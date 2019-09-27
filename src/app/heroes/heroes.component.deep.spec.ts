import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroesComponent } from "./heroes.component";
import { NO_ERRORS_SCHEMA, Input, Component, Directive } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from 'rxjs';
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveSub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick(){
        this.navigatedTo = this.linkParams;
    }
}

describe('HeroesComponent (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach( () => {

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 55 },
            { id: 3, name: 'SuperDude', strength: 24 }
        ];

        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveSub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroesComponent);
        
    });

    it('should render each hero as a HeroComponent', () =>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
        // run ngOnInit
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        
        expect(heroComponentDEs.length).toBe(3);

        for(let i = 0; i < heroComponentDEs.length; i++ ){
            expect(heroComponentDEs[i].componentInstance.hero.name).toEqual(HEROES[i].name);
        }
    });

    it(`should call heroService.delete when 
        the HeroComponent's delete button is clicked`, () => {
            spyOn(fixture.componentInstance, 'delete');
            mockHeroService.getHeroes.and.returnValue(of(HEROES));
        
            fixture.detectChanges();

            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
            // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
            heroComponents[0].triggerEventHandler('delete', null);
            // heroComponent[0].query(By.css('.delete')).triggerEventHandler('click', { stopPropagation: () => {} });
            
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it(`should add a new hero to the hero list when the add button is clicked`, () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const heroName = 'Mr. Pickles';
        mockHeroService.addHero.and.returnValue(of({ id: 4, name: heroName, strength: 4}));

        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        
        inputElement.value = heroName;
        addButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const newHeroText = fixture.debugElement.query(By.css('ul > li:last-child')).nativeElement.textContent;
        expect(newHeroText).toContain(heroName);
    });

    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveSub)).injector.get(RouterLinkDirectiveSub);
        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigatedTo).toBe('/detail/1');
    });
});