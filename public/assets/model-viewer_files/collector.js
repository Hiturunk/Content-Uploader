"use strict";
(() => {
  var K = Object.defineProperty;
  var W = Object.getOwnPropertySymbols;
  var q = Object.prototype.hasOwnProperty,
    Y = Object.prototype.propertyIsEnumerable;
  var G = (e, r, t) =>
      r in e
        ? K(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t })
        : (e[r] = t),
    d = (e, r) => {
      for (var t in r || (r = {})) q.call(r, t) && G(e, t, r[t]);
      if (W) for (var t of W(r)) Y.call(r, t) && G(e, t, r[t]);
      return e;
    };
  var l = (e, r, t) =>
    new Promise((n, a) => {
      var i = (f) => {
          try {
            u(t.next(f));
          } catch (m) {
            a(m);
          }
        },
        o = (f) => {
          try {
            u(t.throw(f));
          } catch (m) {
            a(m);
          }
        },
        u = (f) => (f.done ? n(f.value) : Promise.resolve(f.value).then(i, o));
      u((t = t.apply(e, r)).next());
    });
  function E(e) {
    return l(this, null, function* () {
      return new Promise((r) => setTimeout(r, e));
    });
  }
  function C(e) {
    return JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
  }
  function p(e) {
    return Math.max(-2147483648, Math.min(2147483647, e));
  }
  var z = [
      "ANGLE_instanced_arrays",
      "EXT_blend_minmax",
      "EXT_disjoint_timer_query",
      "EXT_frag_depth",
      "EXT_shader_texture_lod",
      "EXT_sRGB",
      "OES_element_index_uint",
      "OES_fbo_render_mipmap",
      "OES_standard_derivatives",
      "OES_texture_float",
      "OES_texture_half_float",
      "OES_texture_half_float_linear",
      "OES_vertex_array_object",
      "WEBGL_color_buffer_float",
      "WEBGL_depth_texture",
      "WEBGL_draw_buffers",
    ],
    L = [
      "EXT_color_buffer_half_float",
      "EXT_float_blend",
      "EXT_texture_compression_bptc",
      "EXT_texture_compression_rgtc",
      "EXT_texture_filter_anisotropic",
      "KHR_parallel_shader_compile",
      "OES_texture_float_linear",
      "WEBGL_compressed_texture_astc",
      "WEBGL_compressed_texture_etc",
      "WEBGL_compressed_texture_etc1",
      "WEBGL_compressed_texture_pvrtc",
      "WEBKIT_WEBGL_compressed_texture_pvrtc",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_compressed_texture_s3tc_srgb",
      "WEBGL_debug_renderer_info",
      "WEBGL_debug_shaders",
      "WEBGL_lose_context",
      "WEBGL_multi_draw",
    ],
    Z = [
      "EXT_color_buffer_float",
      "EXT_disjoint_timer_query_webgl2",
      "EXT_texture_norm16",
      "OES_draw_buffers_indexed",
      "OVR_multiview2",
      "EXT_polygon_offset_clamp",
      "WEBGL_blend_equation_advanced_coherent",
      "WEBGL_clip_cull_distance",
      "WEBGL_draw_instanced_base_vertex_base_instance",
      "WEBGL_multi_draw_instanced_base_vertex_base_instance",
      "WEBGL_provoking_vertex",
      "WEBGL_shader_pixel_local_storage",
    ];
  var $ = [...L, ...z].sort((e, r) => e.localeCompare(r));
  function O() {
    return $;
  }
  var J = [...L, ...Z].sort((e, r) => e.localeCompare(r));
  function w() {
    return J;
  }
  var P = [
      "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
      "MAX_CUBE_MAP_TEXTURE_SIZE",
      "MAX_FRAGMENT_UNIFORM_VECTORS",
      "MAX_RENDERBUFFER_SIZE",
      "MAX_TEXTURE_IMAGE_UNITS",
      "MAX_TEXTURE_SIZE",
      "MAX_VARYING_VECTORS",
      "MAX_VERTEX_ATTRIBS",
      "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
      "MAX_VERTEX_UNIFORM_VECTORS",
    ],
    Q = [
      "MAX_VIEWPORT_WIDTH",
      "MAX_VIEWPORT_HEIGHT",
      "MAX_TEXTURE_MAX_ANISOTROPY_EXT",
      "MAX_COLOR_ATTACHMENTS_WEBGL",
      "MAX_DRAW_BUFFERS_WEBGL",
    ],
    ee = [
      "MAX_3D_TEXTURE_SIZE",
      "MAX_ARRAY_TEXTURE_LAYERS",
      "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
      "MAX_COLOR_ATTACHMENTS",
      "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
      "MAX_COMBINED_UNIFORM_BLOCKS",
      "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
      "MAX_DRAW_BUFFERS",
      "MAX_ELEMENT_INDEX",
      "MAX_ELEMENTS_INDICES",
      "MAX_ELEMENTS_VERTICES",
      "MAX_FRAGMENT_INPUT_COMPONENTS",
      "MAX_FRAGMENT_UNIFORM_BLOCKS",
      "MAX_FRAGMENT_UNIFORM_COMPONENTS",
      "MAX_PROGRAM_TEXEL_OFFSET",
      "MAX_SAMPLES",
      "MAX_SERVER_WAIT_TIMEOUT",
      "MAX_TEXTURE_LOD_BIAS",
      "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
      "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
      "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
      "MAX_UNIFORM_BLOCK_SIZE",
      "MAX_UNIFORM_BUFFER_BINDINGS",
      "MAX_VARYING_COMPONENTS",
      "MAX_VERTEX_OUTPUT_COMPONENTS",
      "MAX_VERTEX_UNIFORM_BLOCKS",
      "MAX_VERTEX_UNIFORM_COMPONENTS",
      "MIN_PROGRAM_TEXEL_OFFSET",
    ],
    re = [
      "MAX_VIEWPORT_WIDTH",
      "MAX_VIEWPORT_HEIGHT",
      "MAX_TEXTURE_MAX_ANISOTROPY_EXT",
    ];
  function N() {
    return [...P, ...Q].sort((e, r) => e.localeCompare(r));
  }
  function X() {
    return [...ee, ...P, ...re].sort((e, r) => e.localeCompare(r));
  }
  var I = ["VERTEX_SHADER", "FRAGMENT_SHADER"],
    B = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT"],
    h = ["LOW_INT", "MEDIUM_INT", "HIGH_INT"];
  var v = [
    "bgra8unorm-storage",
    "chromium-experimental-dp4a",
    "depth-clamping",
    "depth-clip-control",
    "depth24unorm-stencil8",
    "depth32float-stencil8",
    "float32-filterable",
    "indirect-first-instance",
    "multi-planar-formats",
    "pipeline-statistics-query",
    "rg11b10ufloat-renderable",
    "shader-f16",
    "texture-compression-bc",
    "texture-compression-etc2",
    "texture-compression-astc",
    "timestamp-query",
    "timestamp-query-inside-passes",
  ].sort((e, r) => e.localeCompare(r));
  var y = [
    "maxTextureDimension1D",
    "maxTextureDimension2D",
    "maxTextureDimension3D",
    "maxTextureArrayLayers",
    "maxBindGroups",
    "maxBindingsPerBindGroup",
    "maxDynamicUniformBuffersPerPipelineLayout",
    "maxDynamicStorageBuffersPerPipelineLayout",
    "maxSampledTexturesPerShaderStage",
    "maxSamplersPerShaderStage",
    "maxStorageBuffersPerShaderStage",
    "maxStorageTexturesPerShaderStage",
    "maxUniformBuffersPerShaderStage",
    "maxFragmentCombinedOutputResources",
    "maxUniformBufferBindingSize",
    "maxStorageBufferBindingSize",
    "minUniformBufferOffsetAlignment",
    "minStorageBufferOffsetAlignment",
    "maxVertexBuffers",
    "maxBufferSize",
    "maxVertexAttributes",
    "maxVertexBufferArrayStride",
    "maxInterStageShaderComponents",
    "maxInterStageShaderVariables",
    "maxColorAttachments",
    "maxColorAttachmentBytesPerSample",
    "maxComputeWorkgroupStorageSize",
    "maxComputeInvocationsPerWorkgroup",
    "maxComputeWorkgroupSizeX",
    "maxComputeWorkgroupSizeY",
    "maxComputeWorkgroupSizeZ",
    "maxComputeWorkgroupsPerDimension",
  ].sort((e, r) => e.localeCompare(r));
  var U;
  (function (e) {
    (e[(e.WebGL = 0)] = "WebGL"),
      (e[(e.WebGL2 = 1)] = "WebGL2"),
      (e[(e.WebGPU = 2)] = "WebGPU"),
      (e[(e.WebXR = 3)] = "WebXR");
  })(U || (U = {}));
  function x(e, r) {
    let t = e.getContext(r, { failIfMajorPerformanceCaveat: !0 });
    if (t !== null) return { gl: t, majorPerformanceCaveat: !1 };
    let n = e.getContext(r);
    return { gl: n, majorPerformanceCaveat: n !== null ? !0 : null };
  }
  function b(e) {
    return "OffscreenCanvas" in window
      ? new OffscreenCanvas(1, 1).getContext(e) !== null
      : !1;
  }
  function T(e) {
    let r = e;
    if ("unpackColorSpace" in r && "drawingBufferColorSpace" in r) {
      let a = function (i, o) {
        (r[i] = o), (n[i][o] = r[i] === o);
      };
      var t = a;
      let n = {
        unpackColorSpace: { srgb: !1, "display-p3": !1 },
        drawingBufferColorSpace: { srgb: !1, "display-p3": !1 },
      };
      return (
        a("unpackColorSpace", "srgb"),
        a("unpackColorSpace", "display-p3"),
        a("drawingBufferColorSpace", "srgb"),
        a("drawingBufferColorSpace", "display-p3"),
        n
      );
    }
    return null;
  }
  function M(e) {
    let r = e.getExtension("WEBGL_debug_renderer_info");
    return r === null
      ? null
      : {
          vendor: e.getParameter(r.UNMASKED_VENDOR_WEBGL),
          renderer: e.getParameter(r.UNMASKED_RENDERER_WEBGL),
        };
  }
  function R(e, r) {
    let t = {};
    for (let n of r) t[n] = e.getExtension(n) !== null;
    return t;
  }
  function S(e, r) {
    let t = e,
      n = {};
    for (let u of r) {
      if (!(u in e)) continue;
      let f = e.getParameter(t[u]);
      if (typeof f == "number") n[u] = p(e.getParameter(t[u]));
      else
        throw new Error(`Unhandled WebGL parameter: ${u} of type ${typeof f}`);
    }
    let a = e.getParameter(e.MAX_VIEWPORT_DIMS);
    (n.MAX_VIEWPORT_WIDTH = p(a[0])), (n.MAX_VIEWPORT_HEIGHT = p(a[1]));
    let i = e.getExtension("EXT_texture_filter_anisotropic");
    i !== null &&
      (n.MAX_TEXTURE_MAX_ANISOTROPY_EXT = p(
        e.getParameter(i.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
      ));
    let o = e.getExtension("WEBGL_draw_buffers");
    return (
      o !== null &&
        ((n.MAX_DRAW_BUFFERS_WEBGL = p(
          e.getParameter(o.MAX_DRAW_BUFFERS_WEBGL)
        )),
        (n.MAX_COLOR_ATTACHMENTS_WEBGL = p(
          e.getParameter(o.MAX_COLOR_ATTACHMENTS_WEBGL)
        ))),
      n
    );
  }
  function A(e) {
    let r = e,
      t = {};
    for (let n of I) {
      let a = {};
      for (let i of B) {
        let o = e.getShaderPrecisionFormat(r[n], r[i]);
        o !== null &&
          (a[i] = {
            precision: o.precision,
            rangeMin: o.rangeMin,
            rangeMax: o.rangeMax,
          });
      }
      for (let i of h) {
        let o = e.getShaderPrecisionFormat(r[n], r[i]);
        o !== null && (a[i] = { rangeMin: o.rangeMax, rangeMax: o.rangeMin });
      }
      t[n] = a;
    }
    return t;
  }
  function D() {
    return typeof navigator != "undefined" && "gpu" in navigator
      ? navigator.gpu
      : null;
  }
  function F(e) {
    return l(this, null, function* () {
      return "requestAdapter" in e ? yield e.requestAdapter() : null;
    });
  }
  function V(e, r) {
    let t = r.reduce((a, i) => {
        var o;
        return (a[i] = ((o = e.features) == null ? void 0 : o.has(i)) || !1), a;
      }, {}),
      n = e.features ? [...e.features].filter((a) => r.indexOf(a) < 0) : [];
    return n.length > 0 && (t.other = n.join(",")), t;
  }
  function k(e, r) {
    var i;
    let t = e.limits,
      n = r.reduce((o, u) => (u in t && (o[u] = p(t[u])), o), {}),
      a = Object.keys(
        ((i = e.limits) == null ? void 0 : i.constructor.prototype) || {}
      ).filter((o) => r.indexOf(o) < 0);
    return a.length > 0 && (n.other = a.join(",")), n;
  }
  function H(e) {
    return l(this, null, function* () {
      if (!("requestAdapterInfo" in e)) return {};
      let r = yield e.requestAdapterInfo();
      return {
        vendor: r.vendor,
        device: r.device,
        architecture: r.architecture,
        description: r.description,
      };
    });
  }
  (function () {
    let r = {
      host: "https://web3dsurvey.com",
      samplePercentage: 100,
      delay: 2e3,
    };
    function t() {
      return typeof web3DSurveyConfig == "object"
        ? d(d({}, r), web3DSurveyConfig)
        : r;
    }
    function n(s) {
      return { collectionError: C(s) };
    }
    function a(s, _) {
      try {
        return s();
      } catch (c) {
        return _;
      }
    }
    function i(s) {
      return l(this, null, function* () {
        try {
          return yield s();
        } catch (_) {
          return n(_);
        }
      });
    }
    function o() {
      return l(this, null, function* () {
        let s,
          _ = document.createElement("canvas"),
          { gl: c, majorPerformanceCaveat: g } = x(_, "webgl");
        return (
          c !== null
            ? (s = {
                supported: !0,
                majorPerformanceCaveat: g,
                OffscreenCanvas: "OffscreenCanvas" in window && b("webgl"),
                extensions: R(c, O()),
                parameters: S(c, N()),
                rendererInfo: M(c),
                shaderPrecision: A(c),
                colorSpace: T(c),
              })
            : (s = { supported: !1 }),
          _.remove(),
          s
        );
      });
    }
    function u() {
      return l(this, null, function* () {
        let s,
          _ = document.createElement("canvas"),
          { gl: c, majorPerformanceCaveat: g } = x(_, "webgl2");
        return (
          c !== null
            ? (s = {
                supported: !0,
                majorPerformanceCaveat: g,
                OffscreenCanvas: "OffscreenCanvas" in window && b("webgl2"),
                extensions: R(c, w()),
                parameters: S(c, X()),
                rendererInfo: M(c),
                shaderPrecision: A(c),
                colorSpace: T(c),
              })
            : (s = { supported: !1 }),
          _.remove(),
          s
        );
      });
    }
    function f() {
      return l(this, null, function* () {
        let s = D();
        if (s === null) return { supported: !1 };
        let _ = yield F(s);
        return _ === null
          ? { supported: !0, adapter: !1 }
          : {
              supported: !0,
              adapter: !0,
              isFallbackAdapter: _.isFallbackAdapter,
              features: V(_, v),
              limits: k(_, y),
              adapterInfo: yield H(_),
            };
      });
    }
    function m() {
      return l(this, null, function* () {
        return { supported: "xr" in navigator };
      });
    }
    function j() {
      return l(this, null, function* () {
        let s = a(() => window.location.origin, "error");
        return {
          locationOrigin: s,
          parentLocationOrigin: a(
            () =>
              window.parent !== null ? window.parent.location.origin : null,
            "error"
          ),
          documentReferer: a(
            () =>
              s.indexOf("web3dsurvey.com") > -1 ? document.referrer : null,
            "error"
          ),
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory:
            "deviceMemory" in navigator ? navigator.deviceMemory : null,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth,
          devicePixelRatio: window.devicePixelRatio,
          webdriver: "webdriver" in navigator ? navigator.webdriver : null,
          ImageBitmap: "ImageBitmap" in window,
          OffscreenCanvas: "OffscreenCanvas" in window,
          WebAssembly: "WebAssembly" in window,
          Worker: "Worker" in window,
        };
      });
    }
    document.addEventListener("DOMContentLoaded", () =>
      l(this, null, function* () {
        let s = t();
        if (Math.random() > s.samplePercentage / 100) return;
        yield E(s.delay);
        let _ = {
            webgl: yield i(o),
            webgl2: yield i(u),
            webgpu: yield i(f),
            webxr: yield i(m),
            device: yield i(j),
            version: 22,
          },
          c = `${s.host}/api/stats`;
        (yield fetch(c, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(_),
        })).ok || console.error("Failed to send graphics statistics");
      })
    );
  })();
})();
