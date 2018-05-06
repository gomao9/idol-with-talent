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
      var request_url = './talents.json';

      axios.get(request_url).then(response => {
        app.$set(app, 'talents', response.data.results.bindings.map(function(talent) {
          return new Talent(talent);
        }));
      });
    }
  }
});
