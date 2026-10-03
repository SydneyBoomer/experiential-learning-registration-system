import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { ResearchOpportunity } from '../models/research-opportunity';

@Component({
    selector: 'app-research-opportunity',
    templateUrl: './research-opportunity.html',
    styleUrl: './research-opportunity.css'
})
export class ResearchOpportunityComponent {

    @Input()
    opportunity!: ResearchOpportunity;

    @Input()
    applied = false;

    @Input()
    applying = false;

    @Output()
    apply = new EventEmitter<ResearchOpportunity>();


    onApply(): void {

        if (this.applied || this.applying) {
            return;
        }

        this.apply.emit(this.opportunity);
    }
}