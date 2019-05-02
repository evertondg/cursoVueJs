// Filtros Globaix
Vue.filter('ucwords', function (valor) {
    return valor
        .charAt(0)
        .toUpperCase() + valor.slice(1);
});

// Componente Título : Exibe o título da página
Vue.component(
    'titulo', {
        template: `
            <div class="row"> <!-- root element -->
                <h1>Campeonato Brasileiro série A - 2019</h1>
            </div>    
    `
    }
);

Vue.component('clube', {
    props: [
        'time', 'invertido'
    ],
    template: `
        <div style="display:flex; flex-direction:row"> 
            
           <img :src="time.escudo" :alt="time.nome" class="escudo" :style="{order:  invertido == 'true'? 1 : 2}">  
           <span :style="{order:  invertido == 'true'? 2 : 1}"> {{time.nome | ucwords}}</span>
           <!-- {{invertido}} -->
        </div>    
    `,
    methods: {
        metodo() {
            return this.time;
        }
    }
});

//kebab
Vue.component('clubes-libertadores', {
    props: ['times'],
    template: `
            <div>
                <h3>Times Classificados Libertadores</h3>
                <ul>
                    <li v-for="time in timesLibertadores">
                        <clube :time="time" invertido="true"></clube>
                    </li>
                </ul>
            </div>    
    `,
    computed: {
        timesLibertadores() {
            return this
                .times
                .slice(0, 6);
        }
    }
});

Vue.component('clubes-rebaixados', {
    props: ['times'],
    template: `
        <div>
            <h3>Times Rebaixados
            </h3>
            <ul>
                <li v-for="time in timesRebaixados">
                    <clube :time="time" invertido="true"></clube>
                </li>
            </ul>        
        </div>
    `,
    computed: {
        timesRebaixados() {
            return this
                .times
                .slice(15, 20);
        }
    }
});

Vue.component('tabela-clubes', {
    props: ['times'],
    data() {
        return {
            busca: '',
            ordem: {
                colunas: [
                    'pontos', 'gm', 'gs', 'saldo'
                ],
                orientacao: ['desc', 'desc', 'asc', 'desc']
            },
        }
    },
    template: `
                <div >
                    Busca:
                    <input type="text" class="form-control" v-model="busca">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th v-for="(coluna,indice) in ordem.colunas">
                                    <a href="#" @click.prevent="ordenar(indice)">
                                        {{coluna | ucwords}}
                                    </a>
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(time,indice) in timesFiltrados"
                                :class="{'table-success' : indice < 6}"
                                :style="{'font-size': indice<6 ? '20px':'15px'}">
                                <td>
                                    <!-- <img :src="time.escudo" :alt="time.nome" class="escudo">{{time.nome |
                                    ucwords}} -->
                                    <clube :time="time" invertido="true"></clube>
                                </td>
                                <td>{{time.pontos}}</td>
                                <td>{{time.gm}}</td>
                                <td>{{time.gs}}</td>
                                <!-- <td>{{time | saldo}}</td> -->
                                <td>{{time.saldo}}</td>
                            </tr>
                        </tbody>

                    </table>
                <clubes-libertadores :times="times"></clubes-libertadores>
                <clubes-rebaixados :times="times"></clubes-rebaixados>                    
                </div>    
    `,
    computed: {
        timesFiltrados() {
            console.log('ordem', this.ordem);
            var times = _.orderBy(this.times, this.ordem.colunas, this.ordem.orientacao);
            var self = this;

            return _.filter(times, function (time) {
                var busca = self
                    .busca
                    .toLowerCase();
                return time
                    .nome
                    .toLowerCase()
                    .indexOf(busca) >= 0;
            });

        },
    },
    methods: {
        ordenar(indice) {
            // this.ordem.orientacao[indice] =
            // this.ordem.orientacao[indice]=='desc'?'asc':'desc' ;
            this.$set(
                this.ordem.orientacao,
                indice,
                this.ordem.orientacao[indice] == 'desc' ?
                'asc' :
                'desc'
            )
        }
    },

});

Vue.component('novo-jogo', {
    props: ['timeCasa', 'timeFora'],
    data() {
        return {
            golsCasa: 0,
            golsFora: 0
        }
    },
    template: `

    <form class="form-inline">

        <input type="text" class="form-control" v-model="golsCasa">
        <clube :time="timeCasa" invertido="true" v-if="timeCasa"></clube>
        <span>
            X
        </span>

        <clube :time="timeFora" invertido="true" v-if="timeFora"></clube>
        <input type="text" class="form-control" v-model="golsFora">

                <button type="button" class="btn btn-primary" @click="fimJogo()">
                    Fim de jogo
                </button>
    </form>
                    
    `,
    methods: {

        fimJogo() {
            var golsMarcados = parseInt(this.golsCasa);
            var golsSofridos = parseInt(this.golsFora);
            this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos);
            this.$emit('fim-jogo', {
                golsCasa: parseInt(this.golsCasa),
                golsFora: parseInt(this.golsFora)
            });

        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        times: [
            new Time('america MG', 'assets/america_mg_60x60.png'),
            new Time('Atletico PR', 'assets/atletico-pr_60x60.png'),
            new Time('bahia', 'assets/bahia_60x60.png'),
            new Time('Botafogo', 'assets/botafogo_60x60.png'),
            new Time('Ceara', 'assets/ceara_60x60.png'),
            new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
            new Time('Corinthians', 'assets/corinthians_60x60.png'),
            new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
            new Time('Flamengo', 'assets/flamengo_60x60.png'),
            new Time('Fluminense', 'assets/fluminense_60x60.png'),
            new Time('Gremio', 'assets/gremio_60x60.png'),
            new Time('Internacional', 'assets/internacional_60x60.png'),
            new Time('palmeiras', 'assets/palmeiras_60x60.png'),
            new Time('Parana', 'assets/parana_60x60.png'),
            new Time('Santos', 'assets/santos_60x60.png'),
            new Time('Sao Paulo', 'assets/sao_paulo_60x60.png'),
            new Time('Sport', 'assets/sport_60x60.png'),
            new Time('Vasco', 'assets/vasco_60x60.png'),
            new Time('Vitoria', 'assets/vitoria_60x60.png')

        ],
        // novoJogo: {
        //     casa: {
        //         time: null,
        //         gols: 0
        //     },
        //     fora: {
        //         time: null,
        //         gols: 0
        //     }
        // },
        timeCasa: null,
        timeFora: null,
        visao: 'tabela'
    },
    computed: {
        timesLibertadores() {
            return this
                .times
                .slice(0, 6);
        },
        timesRebaixados() {
            return this
                .times
                .slice(15, 20);
        }
    },
    methods: {
        criarNovoJogo() {
            var indiceCasa = Math.floor(Math.random() * 19),
                indiceFora = Math.floor(Math.random() * 19)

            this.timeCasa = this.times[indiceCasa];
            this.timeFora = this.times[indiceFora];
            this.visao = 'placar';
        },

        showTabela(event) {
            console.log(event);
            this.visao = 'tabela';
        }
    },
    filters: {
        saldo(time) {
            return time.gm - time.gs;
        }
    }
})