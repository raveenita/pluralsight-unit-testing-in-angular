import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach( () => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'Ravena', strength: 58 };
        expect( fixture.componentInstance.hero.name ).toEqual('Ravena');
    });

    it('should render the hero name in an anchor tag With debugElement', () => {
        fixture.componentInstance.hero = { id: 1, name: 'Ravena', strength: 58 };
        fixture.detectChanges();

        //expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('Ravena');
        expect(fixture.nativeElement.querySelector('a').textContent).toContain('Ravena');
    });

});