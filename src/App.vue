<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="glossy">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="fas fa-bars"
        />

        <q-toolbar-title>
          CPU Simulator
        </q-toolbar-title>

        <div>v{{ $store.state.app_version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <q-item clickable to="/" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-layer-group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Simulator</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable to="/about" exact>
          <q-item-section avatar>
            <q-icon name="fas fa-info-circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label>About Author</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "LayoutDefault",
  data() {
    return {
      leftDrawerOpen: !this.$q.platform.is.desktop
    };
  }
};
</script>

<style>
.input-8-bit {
  width: 96px;
}
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  10% {
    opacity: 0;
  }
}
.status {
  animation-iteration-count: infinite;
  animation-duration: 1.5s;
  animation-name: blink;
  text-align: center;
  position: absolute;
  bottom: 16px;
  width: 100%;
  margin: 0;
}

.blink {
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-name: blink;
  color: red;
}
.blink-card {
  animation-iteration-count: infinite;
  animation-duration: 1s;
  animation-name: blink;
}
.blink-card .q-field__control:before {
  border: 2px dashed red !important;
}
</style>
