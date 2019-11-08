<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>AT-UI Example</title>
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/at-ui-style/css/at.min.css">
  <script src="//cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
  <script src="//cdn.jsdelivr.net/npm/at-ui/dist/at.min.js"></script>
  <style>
    #app {
      display: flex;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <div id="app">
    <at-button @click="showMessage">Show message</at-button>
  </div>

  <template>
  <div>
    <at-input v-model="value" placeholder="Please input..."></at-input>
  </div>
</template>

  <script>
    new Vue({
      el: '#app',
      methods: {
        showMessage: function () {
          this.$Message('Thanks for using AT-UI')
        }
      }
    })

export default {
  data() {
    return {
      message: ''
    }
  },
  mounted() {
    const hello = 'Hello World!'
    debugger
    this.message = hello
  }
};
</script>

</body>
</html>