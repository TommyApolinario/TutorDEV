import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModulesService } from '../../../services/modules.service';
import { ActivitiesDetailI, QuestionI } from '../../../interfaces/lessons';
import * as AOS from 'aos';

@Component({
  selector: 'app-true-or-false',
  standalone: true,
  imports: [],
  templateUrl: './true-or-false.component.html',
  styleUrls: ['./true-or-false.component.css', './../select-with-sentence/select-with-sentence.component.css']
})
export class TrueOrFalseComponent {
  //Variables
  @Input() activity: ActivitiesDetailI = {} as ActivitiesDetailI;
  @Output() trueOrFalseAnswer: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() answerUserId: EventEmitter<number> = new EventEmitter<number>();
  selectedOption: string = '';

  //Constructror
  constructor(
    private modulesService: ModulesService
  ) { }

  //ngOnInit()
  ngOnInit() {
    AOS.init();
  }

  //Método que selecciona la opción al hacer click
  selectOption(optionId: string, option: boolean) {
    const inputElement = document.getElementById(optionId) as HTMLInputElement;
    inputElement.click();
    this.selectedOption = optionId;
    this.modulesService.setAnsweredOption(optionId);
    this.trueOrFalseAnswer.emit(option);
    this.answerUserId.emit(this.activity.answer_user.answer_user_id);
  }
}
