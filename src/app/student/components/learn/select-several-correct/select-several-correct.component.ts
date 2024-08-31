import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModulesService } from '../../../services/modules.service';
import { ActivitiesDetailI, QuestionI } from '../../../interfaces/lessons';
import * as AOS from 'aos';

@Component({
  selector: 'app-select-several-correct',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './select-several-correct.component.html',
  styleUrls: ['./select-several-correct.component.css', './../select-with-sentence/select-with-sentence.component.css']
})
export class SelectSeveralCorrectComponent {
  //Variables
  @Input() activity: ActivitiesDetailI = {} as ActivitiesDetailI;
  @Output() multiAnswers: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() answerUserId: EventEmitter<number> = new EventEmitter<number>();
  selectedOptionsForColor: string[] = []; //Array para cambiar los colores de las opciones seleccionadas
  arrayOptions = [
    { id: '1', idHTML: 'option1', label: 'Opción 1', optionNumber: 'a', selected: false },
    { id: '2', idHTML: 'option2', label: 'Opción 2', optionNumber: 'b', selected: false },
    { id: '3', idHTML: 'option3', label: 'Opción 3', optionNumber: 'c', selected: false },
    { id: '4', idHTML: 'option4', label: 'Opción 4', optionNumber: 'd', selected: false },
    { id: '5', idHTML: 'option5', label: 'Opción 5', optionNumber: 'e', selected: false },
    { id: '6', idHTML: 'option6', label: 'Opción 6', optionNumber: 'f', selected: false },
  ];

  //Constructror
  constructor(
    private modulesService: ModulesService
  ) { }

  //ngOnInit()
  ngOnInit() {
    //Agrega las preguntas al array options
    if (this.activity.question && this.activity.question.options && this.activity.question.options.text_options) {
      this.arrayOptions.forEach((option, index) => {
        option.label = this.activity.question.options.text_options[index];
      });
    }
    AOS.init();
  }

  //Método que agrega las opciones seleccionadas al array selectedOptions o las quita si ya existen
  selectOption(optionId: string): void {
    const selectedOptionID = this.arrayOptions.find(option => option.idHTML === optionId);
    if (selectedOptionID) {
      selectedOptionID.selected = !selectedOptionID.selected;
      //Mapea las opciones seleccionadas para cambiar el color mediante el id
      this.selectedOptionsForColor = this.arrayOptions
        .filter(option => option.selected)
        .map(option => option.idHTML);
      this.modulesService.setAnsweredOption(optionId);
      //Mapea las opciones con el label, para enviar el array con opciones seleccionadas
      const selectedOptionsForAnswer = this.arrayOptions
      .filter(option => option.selected)
      .map(option => option.label);
    this.multiAnswers.emit(selectedOptionsForAnswer);
    this.answerUserId.emit(this.activity.answer_user.answer_user_id);
    }
  }
}
