import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModulesService } from '../../../services/modules.service';
import { ActivitiesDetailI } from '../../../interfaces/lessons';
import { Subject, debounceTime } from 'rxjs';
import * as AOS from 'aos';

@Component({
  selector: 'app-complete-paragraph',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './complete-paragraph.component.html',
  styleUrls: ['./complete-paragraph.component.css', './../select-with-sentence/select-with-sentence.component.css']
})
export class CompleteParagraphComponent {

  //Variables
  completeWordForm!: FormGroup;
  @Input() activity: ActivitiesDetailI = {} as ActivitiesDetailI;
  @Output() textToComplete: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() answerUserId: EventEmitter<number> = new EventEmitter<number>();

  private textComplete = new Subject<string>();

  //Constructror
  constructor(
    private formBuilder: FormBuilder,
    private modulesService: ModulesService
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.createCompleteWordForm();
    this.textComplete.pipe(debounceTime(500)).subscribe((searchTerm) => {
      this.answerUserId.emit(this.activity.answer_user.answer_user_id);
      this.modulesService.setAnsweredOption('option1');
    });
    AOS.init();
  }

  //Método que crea el formulario con el input
  createCompleteWordForm() {
    this.completeWordForm = this.formBuilder.group({
      wordToComplete: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ],
      ],
    });
  }

  //Método que escucha el evento de teclado para saber cuando dejó de escribir
  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement) {
      if (this.completeWordForm.get("wordToComplete")?.value !== null && this.completeWordForm.get("wordToComplete")?.value != '' && this.completeWordForm.get("wordToComplete")?.value != undefined) {
        this.textComplete.next(this.completeWordForm.get("wordToComplete")?.value);
        this.textToComplete.emit([(this.completeWordForm.get("wordToComplete")?.value).toLowerCase()]);
      }
    }
  }
}
