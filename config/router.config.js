export default [
  // 系统登录
  {
    path: "/system/login",
    component: "../layouts/UserLayout",
    routes: [
      { path: "/system", redirect: "/system/login/index" },
      { path: "/system/login", redirect: "/system/login/index" },
      { path: "/system/login/index", component: "./System/Login/Login" }
    ]
  },
  {
    path: "/footerbarerror",
    component: "./System/Error/FooterBarError",
  },
  {
    path: "/login",
    component: "../layouts/UserLayout",
    routes: [
      { path: "/login", component: "./System/Login/Login" }
    ]
  },
  // 系统登录
  {
    path: "/",
    component: "../layouts/BasicLayout",
    routes: [
      {
        path: "/home/home",
        name: "Home",
        component: "./Home/Home"
      },
      { path: "/", redirect: "/system/dashboard/analysis" },
      {
        path: "/system/dashboard",
        name: "控制面板",
        routes: [
          {
            path: "/system/dashboard/analysis",
            name: "系统分析",
            component: "./System/Dashboard/Analysis"
          }
        ]
      },
      // 商店管理
      {
        path: "/system/shop",
        name: "商店管理",
        routes: [
          {
            path: "/system/shop/brand",
            name: "品牌管理",
            component: "./System/Shop/Brand/Brand"
          },
          {
            path: "/system/shop/category",
            name: "分类管理",
            component: "./System/Shop/Category/Category"
          },
          {
            path: "/system/shop/product_tag",
            name: "标签管理",
            component: "./System/Shop/ProductTag/ProductTag"
          },
          {
            path: "/system/shop/value_added",
            name: "增值服务管理",
            component: "./System/Shop/ValueAdded/ValueAdded"
          },
          {
            path: "/system/shop/product",
            name: "商品管理",
            component: "./System/Shop/Product/Product"

          }
          ,
          {
            path: "/system/shop/product/add",
            name: "商品新增",
            component: "./System/Shop/Product/ProductInfo"
          }
        ]
      },
      // 文章管理
      {
        path: "/system/article",
        name: "文章管理",
        routes: [
          {
            path: "/system/article/article_tag",
            name: "文章标签",
            component: "./System/Article/ArticleTag/ArticleTag"
          },
          {
            path: "/system/article/article",
            name: "文章管理",
            component: "./System/Article/Article/Article"
          }
        ]
      },
      // 其他管理
      {
        path: "/system/other",
        name: "其他管理",
        routes: [
          {
            path: "/system/other/home_content",
            name: "首页内容",
            component: "./System/Other/HomeContent/HomeContent"
          },
        ]
      },
      // 系统设置
      {
        path: "/system/setting",
        name: "系统设置",
        routes: [
          {
            path: "/system/setting/setting",
            name: "系统设置",
            component: "./System/Base/Setting/Setting"
          },
          {
            path: "/system/setting/area",
            name: "区域",
            component: "./System/Base/Area/Area"
          },
          {
            path: "/system/setting/admin",
            name: "管理员",
            component: "./System/Base/Admin/Admin"
          },
          {
            path: "/system/setting/role",
            name: "角色",
            component: "./System/Base/Role/Role"
          },
          {
            path: "/system/setting/menu",
            name: "菜单",
            component: "./System/Base/Menu/Menu"
          },
          {
            path: "/system/setting/permission",
            name: "权限",
            component: "./System/Base/Permission/Permission"
          }
        ]
      },
      {
        component: "404"
      }
    ]
  }
];
