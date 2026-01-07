<script>
// ============================================
// EXERCICE 10 - Composant générique d'erreurs
// ============================================
// Composant réutilisable pour afficher les erreurs
// de l'API dans Profile.vue et Join.vue

export default {
  name: 'ErrorDisplay',
  props: {
    errors: {
      type: Array,
      default: () => [] // Liste des messages d'erreurs
    }
  }
}
</script>

<template>
  <div v-if="errors.length" class="error-container">
    <ul class="error-list">
      <li v-for="(error, index) in errors" :key="index">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.error-container {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 20px;
  border-radius: var(--radius);
  margin-bottom: 20px;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
