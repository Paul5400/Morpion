<script>
export default {
  data() {
    return {
      user: null
    }
  }
}
</script>

<template>
  <div>
    <h1>Mon Profil</h1>
    <form>
      <div>
        <label for="surnom">Surnom :</label>
        <input id="surnom" v-model="user.surnom" type="text" />
      </div>
      <div>
        <label for="email">Email :</label>
        <input id="email" v-model="user.email" type="email" />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  </div>
</template>
