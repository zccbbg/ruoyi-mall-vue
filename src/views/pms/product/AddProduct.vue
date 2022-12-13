<template lang="pug">
.add-product-wrapper
  el-form.content(
    label-width="108px"
    :model="form"
    ref="form"
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
      image-upload(v-model="form.pic" :limit="1")
    el-form-item(label="商品图片" prop="albumPics")
      image-upload(v-model="form.albumPics" :limit="5")
    el-form-item(label="上架状态")
      dict-select(v-model="form.publishStatus" prop-name="pms_publish_status" )
    el-form-item(label="排序" prop="sort")
      el-input(v-model="form.sort" placeholder="请输入排序")
    el-form-item(label="价格" prop="price")
      el-input(v-model="form.price" placeholder="请输入PRICE")
    el-form-item(label="单位" prop="unit")
      el-input(v-model="form.unit" placeholder="请输入单位")
    el-form-item(label="商品重量" prop="weight")
      el-input(v-model="form.weight" placeholder="商品重量，默认为克")
    .title 规格信息
    el-form-item(label="商品规格")
      .sku-wrapper
        .sku_sorts
          .sku_sort(v-for="(s, idx0) in skuSorts" :key="s.name")
            .label.flex-center
              .flex-one
                dict-select(v-model="s.name" prop-name="sku_sort_list" value-prop="label")
              a.red(@click="deleteSkuSort(idx0)") 删除规格类型
            .values(v-if="s.name")
              .value(v-for="(it2, idx1) in s.options" :key="idx1")
                el-input(:value="it2.name" @input="changeName(s, idx1, $event)")
                a.red.no-break.ml8(v-if="idx1 < s.options.length - 1 || (s.options.length === maxOptionNum && idx1 === 3)" @click="deleteOption(s, idx1)") 删除
        el-button(v-if="skuSorts.length < 2" @click="addSkuSort") 添加规格类型
    el-form-item(label=" 价格")
      el-table(:data="skus" :max-height="800")
        el-table-column(v-for="s in skuSorts" :label="s.name" :key="s.name" :prop="s.name")
        el-table-column(label="展示图片")
        el-table-column(label="销售价格")
        el-table-column(label="编码")
        el-table-column(label="操作")
          template(v-slot="{row, index}")
            a.red 删除{{index}}
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
    .tc
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
      skuSorts: [
        {
          name: '颜色',
          options: [
            {name: '红'},
            {name: null}
          ]
        }
      ],
      maxOptionNum: 44
    }
  },
  computed: {
    skus() {
      let arr = [];
      this.skuSorts.forEach((it1, idx1) => {
        const arr1 = [];
        it1.options.forEach((it2) => {
          if (!it2.name) {
            return
          }
          if (idx1 === 0) {
            arr1.push({[it1.name]: it2.name});
          } else {
            arr.forEach(it3 => {
              arr1.push({...it3, [it1.name]: it2.name })
            })
          }
        })
        arr = arr1;
      })
      arr.forEach(it => {
        it.outSkuId = null;
        it.price = null;
        it.pic = null;
      })
      return arr
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
        const {albumPics } = response
        if (albumPics) {
          response.albumPics = albumPics.split(',')
        }
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

    },
    changeName(s, idx, val) {
      s.options[idx].name = val;
      if (s.options.length - 1 !== idx || s.options.length >= this.maxOptionNum) {
        return
      }
      s.options.push({name: null})
    },
    addSkuSort() {
      this.skuSorts.push({
        name: null,
        options: [{name: null}]
      })
    },
    deleteSkuSort(idx) {
      this.skuSorts.splice(idx);
    },
    deleteOption(s, idx) {
      s.options.splice(idx, 1);
    }
  }
}
</script>

<style lang="stylus">
.add-product-wrapper
  padding 12px
  .content
    margin 0 auto
    width 75%
    min-width 800px
  .sku-wrapper
    background-color #f7f8fa
    padding 12px
    .sku_sorts
      .sku_sort
        background-color white
        margin-bottom 12px
        .label
          padding 8px
        .values
          padding 8px 0 0 8px
          border-top 1px solid $border-color
          display flex
          flex-wrap wrap
          .value
            padding 0 32px 8px 0
            width 200px!important
            display flex
            align-items center
</style>
