
//正在售票(包括正在热映和即将上映)
    aa() {
      this.axios({
        method: "GET",
        url: "PageSubArea/HotPlayMovies.api?",
        params: {
          locatioId: 292,
        },
      })
        .then((result) => {
          
        })
        .catch((err) => {
          
        });
    },
```

```
 //影片详情
    bb() {
      this.axios({
        method: "GET",
        url: "movie/detail.api?",
        params: {
          locationId: 290,
          movieId: 125805,
        },
      })
        .then((result) => {
          
        })
        .catch((err) => {
          
        });
    },

```

```
    //影片评论
    cc() {
      this.axios({
        method: "GET",
        url: "movie/hotComment.api?",
        params: {
          movieId: 125805,
        },
      })
        .then((result) => {
          
        })
        .catch((err) => {
          
        });
    },
```

```
    ee() {
      this.axios({
        method: "GET",
        url: "person/detail.api?",
        params: {
          personId: 913378,
          cityId: 290,
        },
      })
        .then((result) => {
          
        })
        .catch((err) => {
          
        });
    },
```

```text
beforeCreate() {
    var _this = this;

    MP(_this.wMbsZwVAxq82ZefV8fptOmVUkNeaFHBw).then((BMap) => {
      //在此调用api

      _this.getMyLocation();
    });
  },
//定位
getMyLocation() {
      let geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        (r) => {
          let locationName = r.address.city;
          for (const key in this.area.locatioData) {
            if (locationName.startsWith(this.area.locatioData[key].n)) {
              this.id = this.area.locatioData[key].id;
              
            }
          }
        },
        { enableHighAccuracy: true }
      );
    },
```
```text
视频详情
"http://www.eyepetizer.net/detail.html?vid=209646"





```
