import { FormControl } from '@angular/forms';
import { Item, Livro, LivrosResultado } from './../../models/interfaces';
import { Component } from '@angular/core';
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  // listaLivros: Livro[];
  campoBusca = new FormControl();
  // subscription: Subscription;
  // livro: Livro;
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) {}

  // totalDeLivros$ = this.campoBusca.valueChanges.pipe(
  //   debounceTime(PAUSA),
  //   tap(() => console.log('fluxo inicial')),
  //   filter((valorDigitado) => valorDigitado.length >= 3),
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map(resultado => this.livrosResultado = resultado),
  //   catchError(erro => {
  //     console.log(erro)
  //     return of()
  //   })
  //   )

  //boa pratica colocar $ para representar um Observable
  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    // tap(() => {console.log('Fluxo inicial de dados');}),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    tap((retornoAPI) => console.log(retornoAPI)),
    map((resultado) => resultado.items ?? []),
    // tap(console.log),
    map((items) => this.livrosResultadoParaLivros(items)),
    catchError((erro) => {
      // catchError(() => {
      //   this.mensagemErro = 'Ops, ocorreu um erro, Recarregue a aplicação'
      //   return EMPTY
      // })
      //outra opcao para utilizar algo com o erro

      console.log(erro);
      return throwError(() =>new Error(this.mensagemErro = `Ops, ocorreu um erro! Recarregue a aplicação!`));
    })
  );

  // buscarLivros(){
  //   this.subscription = this.service.buscar(this.campoBusca).subscribe({
  //     next: (items) => {
  //       console.log('requisicoes ao servidor')
  //       this.listaLivros = this.livrosResultadosParaLivros(items)
  //     },
  //     error: erro => console.log(erro),
  //     // complete: () => console.log('Observable completado')
  //   }
  //   )
  // }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }

  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }
}
