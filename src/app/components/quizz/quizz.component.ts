import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json";

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent implements OnInit {

  title: string = "";
  questions: any[] = [];
  questionSelected: any;

  answers: string[] = [];
  answerSelected: { text: string; playlist: string } | null = null;
  playlistLink: string = "";

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionMaxIndex = this.questions.length;
      this.questionSelected = this.questions[this.questionIndex];

      console.log("Quiz iniciado...");
      console.log("Total de perguntas:", this.questionMaxIndex);
    }
  }

  playerChoose(value: string) {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep() {
    this.questionIndex++;

    if (this.questionIndex < this.questionMaxIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;

      // 🔹 Pegamos o resultado correto do JSON
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];

      // 🔹 Ajustamos a URL para o formato embed do Spotify
      this.playlistLink = this.answerSelected?.playlist
        ? this.answerSelected.playlist.replace("open.spotify.com/playlist/", "open.spotify.com/embed/playlist/")
        : "";

      console.log("Resultado final:", this.answerSelected);
      console.log("Playlist URL:", this.playlistLink);
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((previous, current, i, arr) => {
      return arr.filter(item => item === previous).length > arr.filter(item => item === current).length
        ? previous
        : current;
    });

    return result;
  }

  restartQuiz() {
    this.finished = false;
    this.answers = [];
    this.answerSelected = null;
    this.playlistLink = "";
    this.questionIndex = 0;
    this.questionSelected = this.questions[this.questionIndex];

    console.log("Quiz reiniciado!");
  }
}
