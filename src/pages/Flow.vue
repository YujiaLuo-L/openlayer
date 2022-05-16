<template>
    <div id="map_container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { initMap } from '@/mapLibs/initMap';
import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Style, Stroke } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { addFlow } from '@/mapLibs/flow';

onMounted(() => {
    const map = initMap('map_container');
    // 根据多个点绘制线
    const lineCoords = [
        [117.57054, 35.34],
        [119.9039, 36.7616],
        [118.754, 33.6899],
    ];
    const lineFeature = new Feature({
        geometry: new LineString(lineCoords),
        factor: 1e6,
    });
    const LineStyle = new Style({
        stroke: new Stroke({
            width: 6,
            color: [237, 212, 0, 0.8],
        }),
    });
    lineFeature.setStyle(LineStyle);
    const lineVector = new VectorLayer({
        source: new VectorSource({
            features: [lineFeature],
        }),
    });
    map.addLayer(lineVector);
    addFlow(map, lineFeature, lineVector);
});
</script>

<style lang="scss" scoped>
#map_container {
    width: 100%;
    height: 100%;
}
</style>
