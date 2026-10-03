import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { ResearchOpportunity } from '../models/research-opportunity';

@Component({
    selector: 'app-teaching-assistant',
    templateUrl: './teaching-assistant.html',
    styleUrl: './teaching-assistant.css'
})
export class TeachingAssistantComponent {

    @Input()
    opportunity!: ResearchOpportunity;

    @Input()
    applied = false;

    @Output()
    apply = new EventEmitter<ResearchOpportunity>();

    onApply(): void {

        if (this.applied) {
            return;
        }

        this.apply.emit(this.opportunity);
    }
}