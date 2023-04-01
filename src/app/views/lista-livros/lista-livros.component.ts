import { ImageLinks, Livro, Item,LivroResultado } from './../../models/interfaces';
import { Component, OnDestroy } from '@angular/core';
import {
  switchMap,
  map,
  tap,
  filter,
  debounceTime,
  distinctUntilChanged,
  catchError,
  throwError,
} from 'rxjs';
import { LivroService } from 'src/app/service/livro.service';
import { LivroVolumeInfor } from 'src/app/models/livroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = ''
  livrosResultado: LivroResultado;

  constructor(private livroService: LivroService) {}

  livrosEncotrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo inicial')),
      switchMap((valorDigitado) => this.livroService.buscar(valorDigitado)),
      map(resultado => this.livrosResultado = resultado),
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultadoParaLivros(items)),
      catchError((erro) => {
        // this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'
        // return EMPTY
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro ='Ops, ocorreu um erro. Recarregue a aplicação!'))
      })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfor[] {
    return items.map((item) => {
      return new LivroVolumeInfor(item);
    });
  }
}
