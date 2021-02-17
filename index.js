const image;
new Vue({
  el: "#app",
  data: {
    message: "Try Preview!",
    images: [],
    url: "",
  },
  methods: {
    uploadFile() {
      const file = this.$refs.preview.files[0];
      this.url = URL.createObjectURL(file);
    },
    deletePreview() {
      this.url = "";
      URL.revokeObjectURL(this.url);
      this.$refs.preview.value = "";
    },
    changeBase64(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.generateImageUrl(e.target.result);
      };
      reader.readAsDataUrl(file);
    },
    generateImgUrl(file) {
      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.onload = (e) => {
        const resizedBase64 = this.makeResizeImg(image);
        this.images.push(resizedBase64);
      };
      image.src = file;
    },
    makeResizeImg(image) {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d"); // 2Dコンテキスト
      // 縦横で長い方の最大値を1000とする
      const MAX_SIZE = 1000;
      // MAX_SIZEよりも小さかったらそのまま
      if (image.width < MAX_SIZE && image.height < MAX_SIZE) {
        [canvas.width, canvas.height] = [image.width, image.height];
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL("image/jpeg");
      }
      let dstWidth;
      let dstHeight;
      // 縦横比の計算
      if (image.width > image.height) {
        dstWidth = MAX_SIZE;
        dstHeight = (image.height * MAX_SIZE) / image.width;
      } else {
        dstHeight = MAX_SIZE;
        dstWidth = (image.width * MAX_SIZE) / image.height;
      }
      canvas.width = dstWidth;
      canvas.height = dstHeight;
      // リサイズ
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        dstWidth,
        dstHeight
      );
      // data_url形式に変換したものを返す
      return canvas.toDataURL("image/jpeg");
    },
    removeImage(index) {
      this.$delete(this.images, index);
    },
  },
});
