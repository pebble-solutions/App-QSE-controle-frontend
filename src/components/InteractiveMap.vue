<template>
    <div>
    <div id="map-container" style="position: relative; display: flex; justify-content: flex-end; width: 80%;">
    <div id="map">
    <img src="../assets/Map-FranceCustom.png" style="width: 100%; height: auto;">
    <div class="dot" :style="{ left: `${longitude}%`, top: `${latitude}%` }"></div>
    </div>
    </div>
    </div>

<!-- POSITION en pourcentage pour debug
    <div class="card text-center">
        <div class="fw-bold"><br>Position du pin : </div>
        <div>Latitude en % : {{ 100 - latitude }}</div>
        <div>Longitude en %: {{ longitude }}</div>
    </div>

-->
</template>

<script>
export default {
  data() {
    return {
      dates: [],
      imageBounds: {
        left: -5.684968390884571,
        right: 8.971890223001154,
        top: 51.670669181924744,
        bottom: 41.71645783266676,
      },
      location: {
        lat: 47.75154092165214, 
        lng: -3.380535388953933,
      },
    };
  },

  computed: {
    latitude() {
const latDifference = this.imageBounds.top - this.imageBounds.bottom;
const percentage = 100 * (this.imageBounds.top - this.location.lat) / latDifference;
return percentage;
},
longitude() {
const lngDifference = this.imageBounds.right - this.imageBounds.left;
return 100 * (this.location.lng - this.imageBounds.left) / lngDifference;
},
  },
};
</script>

<style scoped>

.dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>