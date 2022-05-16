/**
 * 流向问题，在县域水务项目中是使用在管线的中电添加箭头表示
 */
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Icon, Style } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { getVectorContext } from 'ol/render';

export function addFlow(map: any, lineFeature: any, lineVector: any) {
    const position = new Point(lineFeature.getGeometry().getFirstCoordinate());
    const iconFeature = new Feature({ geometry: position });
    const mysvg = new Image(32, 32);
    mysvg.src = 'src/assets/img/leftArrow.svg';
    let angle = 0;
    const icon = new Icon({
        img: mysvg,
        imgSize: [32, 32],
        rotation: angle,
        scale: 0.8, //修改图标大小
    });
    const iconStyle = new Style({
        image: icon,
    });
    iconFeature.setStyle(iconStyle);
    const iconVector = new VectorLayer({
        source: new VectorSource({
            features: [iconFeature],
        }),
    });
    map.addLayer(iconVector);
    //计算线段的角度
    const getAngle = (startPoint: any, endPoint: any) => {
        const myangle = Math.atan2(
            startPoint[1] - endPoint[1],
            startPoint[0] - endPoint[0],
        ); //Math.atan2( (p1.y-p2.y) , (p2.x-p1.x))
        return myangle;
    };
    let distance = 0;
    let lastTime: any;

    function moveFeature(event: any) {
        // const speed = Number(speedInput.value);
        const speed = 200;
        const time = event.frameState.time;
        const elapsedTime = time - lastTime;
        distance = (distance + (speed * elapsedTime) / 1e6) % 2;
        lastTime = time;

        const currentCoordinate = lineFeature
            .getGeometry()
            .getCoordinateAt(distance > 1 ? distance - 1 : distance);
        //放箭头时，需要实时改变箭头的方向
        angle = getAngle(position.getCoordinates(), currentCoordinate);

        icon.setRotation(-angle);

        position.setCoordinates(currentCoordinate);

        const vectorContext = getVectorContext(event);
        vectorContext.setStyle(iconStyle);
        vectorContext.drawGeometry(position);
        // tell OpenLayers to continue the postrender animation
        map.render();
    }
    function startAnimation() {
        lastTime = Date.now();
        // startButton.textContent = "Stop Animation";
        lineVector.on('postrender', moveFeature);
        // hide geoMarker and trigger map render through change event
        // iconFeature.setGeometry(null);
    }

    startAnimation(); //开启动画效果
}
