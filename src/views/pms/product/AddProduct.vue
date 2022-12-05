<template lang="pug">
.add-product-wrapper
  el-form(
    label-width="108px"
    :model="form"
    ref="form"
    :rules="rules"
  )
    el-form-item(label="品牌" prop="brandId")
      brand-select(v-model="form.brandId")
    el-form-item(label="分类" prop="categoryId")
      prod-category.w200(v-model="form.categoryId")
    el-form-item(label="商品编码" prop="outProductId")
      el-input(v-model="form.outProductId" placeholder="请输入商品编码")
    el-form-item(label="商品名称" prop="name")
      el-input(v-model="form.name" placeholder="请输入商品名称")
    el-form-item(label="主图" prop="pic")
      el-input(v-model="form.pic" placeholder="请输入主图")
    el-form-item(label="商品图片" prop="albumPics")
      el-input(v-model="form.albumPics" placeholder="商品图片，连产品图片限制为5张，以逗号分割")
    el-form-item(label="上架状态")
      dict-select(v-model="form.publishStatus")
    el-form-item(label="排序" prop="sort")
      el-input(v-model="form.sort" placeholder="请输入排序")
    el-form-item(label="价格" prop="price")
      el-input(v-model="form.price" placeholder="请输入PRICE")
    el-form-item(label="单位" prop="unit")
      el-input(v-model="form.unit" placeholder="请输入单位")
    el-form-item(label="商品重量" prop="weight")
      el-input(v-model="form.weight" placeholder="商品重量，默认为克")
    el-form-item(label="产品详情网页内容" prop="detailHtml")
      el-input(
        v-model="form.detailHtml"
        placeholder="请输入内容"
        type="textarea"
      )
    el-form-item(label="移动端网页详情" prop="detailMobileHtml")
      el-input(
        v-model="form.detailMobileHtml"
        placeholder="请输入内容"
        type="textarea"
      )
    div
      el-button(type="primary" @click="submitForm") 确 定
      el-button(@click="cancel") 取 消
</template>

<script>
import {addPmsProduct, getPmsProduct, updatePmsProduct} from "@/api/pms/product";
import ProdCategory from "@/views/components/ProdCategory";
import BrandSelect from "@/views/components/BrandSelect";

export default {
  name: "AddProduct",
  components: {BrandSelect, ProdCategory},
  data() {
    return {
      form: {},
      rules: []
    }
  },
  created() {
    const {id} = this.$route.query
    if (id) {
      this.getInfo(id);
    }
  },
  methods: {
    getInfo(id) {
      getPmsProduct(id).then(response => {
        this.form = response;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePmsProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPmsProduct(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    cancel() {

    }
  }
}
</script>

<style lang="stylus">
.add-product-wrapper
  padding 12px
</style>
