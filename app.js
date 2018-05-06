Vue.use(Buefy.default)

class Idol {
  constructor(hash) {
    var pairs = Object.entries(hash);
    for (var index in pairs) {
      var [key, value] = pairs[index];
      if (key == 'NaN') {
        continue;
      };

      this[key.slice(1)] = value;
    };

    this.weightInt   = parseInt(this.weight, 10);
    this.heightInt   = parseInt(this.height, 10);
    this.ageInt      = parseInt(this.age, 10);
  }
}

class Talent {
  constructor(hash) {
    this.name   = hash.name.value;
    this.height = hash.height.value;
    this.bust   = hash.bust.value;
    this.waist  = hash.waist.value;
    this.hip    = hash.hip.value;

    this.heightFloat = parseFloat(hash.height.value);
    this.bustFloat   = parseFloat(hash.bust.value);
    this.waistFloat  = parseFloat(hash.waist.value);
    this.hipFloat    = parseFloat(hash.hip.value);
  }
}

var app = new Vue({
  el: '#app',
  data: function() {
    return {
      keyword: '',
      idols: [],
      talents: [],
    }
  },
  mounted: function () {
    this.idols = this.get_profile();
    this.get_wikipedia();
  },
  methods: {
    get_profile: function (cds, units) {
      var idols = YAML.load('https://bitbucket.org/gomao9/idol-profile/raw/master/profile.yml')
      return Object.values(idols).map(function(idol) {
        return new Idol(idol);
      });
    },
    get_wikipedia: () => {
      var request_url = 'http://ja.dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fja.dbpedia.org&query=prefix+dbp-owl%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0A%0D%0Aselect++%3Fname+%3Fbust+%3Fwaist+%3Fhip+%3Fheight+where+%7B%0D%0A++++%3Fidol+dbp-owl%3AwikiPageWikiLink+category-ja%3A%E3%82%B0%E3%83%A9%E3%83%93%E3%82%A2%E3%82%A2%E3%82%A4%E3%83%89%E3%83%AB+.%0D%0A++++%3Fidol+rdfs%3Alabel+%3Fname+.%0D%0A++++%3Fidol+%3Chttp%3A%2F%2Fja.dbpedia.org%2Fproperty%2F%E3%83%90%E3%82%B9%E3%83%88%3E+%3Fbust+.%0D%0A++++%3Fidol+%3Chttp%3A%2F%2Fja.dbpedia.org%2Fproperty%2F%E3%82%A6%E3%82%A8%E3%82%B9%E3%83%88%3E+%3Fwaist+.%0D%0A++++%3Fidol+%3Chttp%3A%2F%2Fja.dbpedia.org%2Fproperty%2F%E3%83%92%E3%83%83%E3%83%97%3E+%3Fhip+.%0D%0A++++%3Fidol+%3Chttp%3A%2F%2Fja.dbpedia.org%2Fproperty%2F%E8%BA%AB%E9%95%B7%3E+%3Fheight+.%0D%0A%7D&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on';

      axios.get(request_url).then(response => {
        app.$set(app, 'talents', response.data.results.bindings.map(function(talent) {
          return new Talent(talent);
        }));
      });
    }
  }
});
