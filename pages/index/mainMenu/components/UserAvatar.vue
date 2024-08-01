<template>
<div style="width: 50px;height: 50px;border-radius: 10px;">
  <img :src="src" width="50px" height="50px">
</div>


</template>

<script>

export default {
  name: "UserAvatar",
  props:['src'],
  create(){
    console.log(this.src)
  }


}
</script>



<style scoped>

</style>