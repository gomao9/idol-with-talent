Vue.use(Buefy.default)
Vue.component('v-select', VueSelect.VueSelect);

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

    this.heightFloat = parseFloat(this.height);
    this.bustFloat   = parseFloat(this.bust);
    this.waistFloat  = parseFloat(this.waist);
    this.hipFloat    = parseFloat(this.hip);
    this.optionText = this.name + '(' + this.height + 'cm ' + this.bust + '-' + this.waist + '-' + this.hip + ')';
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
    this.link        = `https://ja.wikipedia.org/w/index.php?curid=${hash.pid.value}`
  }
}
var app = new Vue({
  el: '#app',
  data: function() {
    return {
      keyword: '',
      idols: [],
      talents: [],
      selected: null,
      height: null,
      bust: null,
      waist: null,
      hip: null,
      threshold: 1.0,
    }
  },
  mounted: function () {
    this.idols = this.get_profile();
    this.get_wikipedia();
  },
  computed: {
    filtered_talents: function () {
      return this.talents.filter((talent) => {
        return this.isTalentInRange(talent);
      }) ;
    }
  },
  methods: {
    isTalentInRange: function(talent) {
        return this.isInRange(this.height, talent.heightFloat) &&
               this.isInRange(this.bust,   talent.bustFloat) &&
               this.isInRange(this.waist,  talent.waistFloat) &&
               this.isInRange(this.hip,    talent.hipFloat);
    },
    isInRange: function(inputted, talent) {
      return (talent - this.threshold) <= inputted && inputted <= (talent + this.threshold);
    },
    get_profile: function (cds, units) {
      var idols = YAML.load('https://bitbucket.org/gomao9/idol-profile/raw/master/profile.yml')
      return Object.values(idols).map(function(idol) {
        i = new Idol(idol);
        if(i.gender == 'female' && i.name) {
          return i;
        }
      }).filter(Boolean);
    },
    get_wikipedia: () => {
      var request_url = './talents.json';

      axios.get(request_url).then(response => {
        app.$set(app, 'talents', response.data.results.bindings.map(function(talent) {
          return new Talent(talent);
        }));
      });
    },
    onSelected: function() {
      if (!this.selected) {
        this.height = this.bust = this.waist = this.hip = null;
        return;
      }

      this.height = this.selected.heightFloat;
      this.bust = this.selected.bustFloat;
      this.waist = this.selected.waistFloat;
      this.hip = this.selected.hipFloat;
    }
  }
});
