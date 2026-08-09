## 常量

```java
#define UNITY_PI            3.14159265359f
#define UNITY_TWO_PI        6.28318530718f
#define UNITY_FOUR_PI       12.56637061436f
#define UNITY_INV_PI        0.31830988618f
#define UNITY_INV_TWO_PI    0.15915494309f
#define UNITY_INV_FOUR_PI   0.07957747155f
#define UNITY_HALF_PI       1.57079632679f
#define UNITY_INV_HALF_PI   0.636619772367f
#define UNITY_HALF_MIN      6.103515625e-5
```

```java
#ifdef UNITY_COLORSPACE_GAMMA
#define unity_ColorSpaceGrey fixed4(0.5, 0.5, 0.5, 0.5)
#define unity_ColorSpaceDouble fixed4(2.0, 2.0, 2.0, 2.0)
#define unity_ColorSpaceDielectricSpec half4(0.220916301, 0.220916301, 0.220916301, 1.0 - 0.220916301)
#define unity_ColorSpaceLuminance half4(0.22, 0.707, 0.071, 0.0) // Legacy: Alpha设置为0.0以指定gamma模式
#else // 线性值
#define unity_ColorSpaceGrey fixed4(0.214041144, 0.214041144, 0.214041144, 0.5)
#define unity_ColorSpaceDouble fixed4(4.59479380, 4.59479380, 4.59479380, 2.0)
#define unity_ColorSpaceDielectricSpec half4(0.04, 0.04, 0.04, 1.0 - 0.04) // 标准介质反射率系数入射角（= 4%）
#define unity_ColorSpaceLuminance half4(0.0396819152, 0.458021790, 0.00609653955, 1.0) // Legacy: alpha设置为1.0以指定线性模式
#endif

// 这些常量必须与rgbmrange .h保持同步
#define LIGHTMAP_RGBM_SCALE 5.0
#define EMISSIVE_RGBM_SCALE 97.0
```
## 结构体

```C++
struct appdata_base {
    float4 vertex : POSITION;
    float3 normal : NORMAL;
    float4 texcoord : TEXCOORD0;
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

struct appdata_tan {
    float4 vertex : POSITION;
    float4 tangent : TANGENT;
    float3 normal : NORMAL;
    float4 texcoord : TEXCOORD0;
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

struct appdata_full {
    float4 vertex : POSITION;
    float4 tangent : TANGENT;
    float3 normal : NORMAL;
    float4 texcoord : TEXCOORD0;
    float4 texcoord1 : TEXCOORD1;
    float4 texcoord2 : TEXCOORD2;
    float4 texcoord3 : TEXCOORD3;
    fixed4 color : COLOR;
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

struct v2f_vertex_lit {
    float2 uv   : TEXCOORD0;
    fixed4 diff : COLOR0;
    fixed4 spec : COLOR1;
};

// Helpers used in image effects. Most image effects use the same
// minimal vertex shader (vert_img).

struct appdata_img
{
    float4 vertex : POSITION;
    half2 texcoord : TEXCOORD0;
    UNITY_VERTEX_INPUT_INSTANCE_ID
};

struct v2f_img
{
    float4 pos : SV_POSITION;
    half2 uv : TEXCOORD0;
    UNITY_VERTEX_INPUT_INSTANCE_ID
    UNITY_VERTEX_OUTPUT_STEREO
};

```

## 函数

```C++
//与现有着色器的兼容性遗留
bool IsGammaSpace()
float GammaToLinearSpaceExact(float value)
half3 GammaToLinearSpace(half3 sRGB)
float LinearToGammaSpaceExact(float value)
float LinearToGammaSpace(half3 linRGB)
```

### 空间变换

```C++
float4 UnityWorldToClipPos(in float3 pos)//将位置从世界空间转换到齐次空间
float4 UnityViewToClipPos(in float3 pos)//将位置从视图空间转换到齐次空间
float3 UnityObjectToViewPos(in float3 pos)//将位置从对象空间转换到相机空间
float3 UnityObjectToViewPos(float4 pos) //重载函数，用于float4类型；避免现有着色器的“隐式截断”警告
float3 UnityWorldToViewPos(in float3 pos)//将位置从世界空间转换到相机空间

float3 UnityObjectToWorldDir(in float3 dir)//将方向从对象空间转换到世界空间
float3 UnityWorldToObjectDir(in float3 dir)//将方向从对象空间转换到世界空间

float3 UnityObjectToWorldNormal(in float3 norm)//将法线从对象空间转换到世界空间

float3 UnityWorldSpaceLightDir(in float3 worldPos)//从世界空间位置计算世界空间中的光方向
float3 WorldSpaceLightDir(in float4 localPos)//从对象空间位置计算世界空间中的光方向*Legacy* 请使用 UnityWorldSpaceLightDir 代替
float3 ObjSpaceLightDir(in float4 v)//计算对象空间中的光方向
float3 UnityWorldSpaceViewDir(in float3 worldPos)//从世界空间位置计算世界空间中的视图方向
float3 WorldSpaceViewDir(in float4 localPos)//从对象空间位置计算世界空间中的视图方向*Legacy* 请使用 UnityWorldSpaceViewDir 代替
float3 ObjSpaceViewDir(in float4 v)//计算对象空间中的视图方向
```

### 光源计算

```C++
// 用于ForwardBase通道：计算4个点光源的漫射照明，数据以一种特殊的方式打包。
float3 Shade4PointLights (
    float4 lightPosX, float4 lightPosY, float4 lightPosZ,
    float3 lightColor0, float3 lightColor1, float3 lightColor2, float3 lightColor3,
    float4 lightAttenSq,
    float3 pos, float3 normal)

// 用于顶点通道：从lightCount灯光中计算漫射照明。将true指定为spotLight的开销更大
// 为了计算，光被视为聚光灯，否则它们被视为点光。
float3 ShadeVertexLightsFull (float4 vertex, float3 normal, int lightCount, bool spotLight)

float3 ShadeVertexLights (float4 vertex, float3 normal)

//球谐光照计算
// 正态应归一化，w=1.0
half3 SHEvalLinearL0L1 (half4 normal)
// 正态应归一化，w=1.0
half3 SHEvalLinearL2 (half4 normal)
// 正态应归一化，w=1.0
// 在活动色彩空间中输出
half3 ShadeSH9 (half4 normal)
// 废弃：为了向后兼容5.0
half3 ShadeSH3Order(half4 normal)

#if UNITY_LIGHT_PROBE_PROXY_VOLUME
// 正态应归一化，w=1.0
half3 SHEvalLinearL0L1_SampleProbeVolume (half4 normal, float3 worldPos)
#endif
// 正态应归一化，w=1.0
half3 ShadeSH12Order (half4 normal)
fixed4 VertexLight(v2f_vertex_lit i, sampler2D mainTex)
```

### 纹理，贴图

```C++
// 计算UV偏移为视差凹凸映射
float2 ParallaxOffset( half h, half height, half3 viewDir )
// 将颜色转换为亮度（灰度）
half Luminance(half3 rgb)
// 将rgb转换为亮度
// 与rgb在线性空间与sRGB原色和D65白点
half LinearRgbToLuminance(half3 linearRgb)
half4 UnityEncodeRGBM(half3 color, float maxRGBM)
// 解码HDR纹理
// 处理dLDR，RGBM格式
half3 DecodeHDR(half4 data, half4 decodeInstructions, int colorspaceIsGamma)
// 解码HDR纹理
// 处理dLDR，RGBM格式
half3 DecodeHDR(half4 data, half4 decodeInstructions)
// 解码HDR纹理
// 处理dLDR，RGBM格式
half3 DecodeLightmapRGBM (half4 data, half4 decodeInstructions)
// 解码双eldr编码光图。
half3 DecodeLightmapDoubleLDR( fixed4 color, half4 decodeInstructions)
half3 DecodeLightmap( fixed4 color, half4 decodeInstructions)
half3 DecodeLightmap( fixed4 color )
//解码点亮RGBM编码光图 
//注意：启发动态纹理RGBM格式不同于标准Unity HDR纹理 
//（如烘焙光贴图，反射探针和IBL图像） 
//相反，enlightenment在线性色彩空间中提供不同指数的RGBM纹理。 
//警告：3功率操作，可能非常昂贵的移动！
half3 DecodeRealtimeLightmap( fixed4 color )
//在定向（非镜面）模式下，照亮主光方向
//在某种程度上，使用它的一半兰伯特然后除以“再平衡系数”
//给出的结果接近普通的漫反射光映射，但法线映射。
//注意dir不是单位长度。它的长度是“方向性”，就像
//用于定向高光贴图。
half3 DecodeDirectionalLightmap(half3 color, fixed4 dirTex, half3 normalWorld)

//编码/解码[0..1)浮点到8位/通道RGBA。注意1.0不会被正确编码。
float4 EncodeFloatRGBA( float v )
float DecodeFloatRGBA( float4 enc )
//编码/解码[0..1]浮点到8位/通道RG。注意1.0不会被正确编码。
float2 EncodeFloatRG( float v )
//编码/解码视图空间法线到2D 0..1的向量
float2 EncodeViewNormalStereo( float3 n )
float3 DecodeViewNormalStereo( float4 enc4 )
float4 EncodeDepthNormal( float depth, float3 normal )
void DecodeDepthNormal( float4 enc, out float depth, out float3 normal )
fixed3 UnpackNormalDXT5nm (fixed4 packednormal)
//解包为DXT5nm （1, y, 1, x）或BC5 （x, y, 0, 1）
//注意中性纹理，如“bump”是（0,0,1,1），用于普通RGB normal和DXT5nm/BC5
fixed3 UnpackNormalmapRGorAG(fixed4 packednormal)
fixed3 UnpackNormal(fixed4 packednormal)
fixed3 UnpackNormalWithScale(fixed4 packednormal, float scale)
//Z缓冲区到线性0..1深度
float Linear01Depth( float z )
//Z缓冲区到线性深度
float LinearEyeDepth( float z )
float2 UnityStereoScreenSpaceUVAdjustInternal(float2 uv, float4 scaleAndOffset)
float4 UnityStereoScreenSpaceUVAdjustInternal(float4 uv, float4 scaleAndOffset)

#if defined(UNITY_SINGLE_PASS_STEREO)
float2 TransformStereoScreenSpaceTex(float2 uv, float w)
float2 UnityStereoTransformScreenSpaceTex(float2 uv)
float4 UnityStereoTransformScreenSpaceTex(float4 uv)
float4 UnityStereoTransformScreenSpaceTex(float4 uv)
#else
#define TransformStereoScreenSpaceTex(uv, w) uv
#define UnityStereoTransformScreenSpaceTex(uv) uv
#define UnityStereoClamp(uv, scaleAndOffset) uv
#endif

float2 MultiplyUV (float4x4 mat, float2 inUV)
v2f_img vert_img( appdata_img v )
float4 ComputeNonStereoScreenPos(float4 pos)
float4 ComputeScreenPos(float4 pos)
float4 ComputeGrabScreenPos(float4 pos)

//将转换后的位置固定到屏幕像素
float4 UnityPixelSnap (float4 pos)
float2 TransformViewToProjection (float2 v)
float3 TransformViewToProjection (float3 v)

float4 PackHeightmap(float height)
{
    #if (API_HAS_GUARANTEED_R16_SUPPORT)
        return height;
    #else
        uint a = (uint)(65535.0f * height);
        return float4((a >> 0) & 0xFF, (a >> 8) & 0xFF, 0, 0) / 255.0f;
    #endif
}

float UnpackHeightmap(float4 height)
{
    #if (API_HAS_GUARANTEED_R16_SUPPORT)
        return height.r;
    #else
        return (height.r + height.g * 256.0f) / 257.0f; // (255.0f * height.r + 255.0f * 256.0f * height.g) / 65535.0f
    #endif
}
```

### 阴影投射

```C++
float4 UnityEncodeCubeShadowDepth (float z)
float UnityDecodeCubeShadowDepth (float4 vals)
float4 UnityClipSpaceShadowCasterPos(float4 vertex, float3 normal)
float4 UnityClipSpaceShadowCasterPos(float3 vertex, float3 normal)// Legacy：不再使用；保持不破坏现有的用户着色器
float4 UnityApplyLinearShadowBias(float4 clipPos)
```

## 宏定义

```java
//是否执行SH（光探针/环境）计算？
// -当静态和动态光图可用时，不执行SH评估
// -当静态和动态光图不可用时，总是执行SH计算
// -对于低电平lod，静态光图和来自光探针的实时GI可以组合在一起
// -不做环境渲染的通道（添加，暗影施法者等）也不应该做SH。
#define UNITY_SHOULD_SAMPLE_SH (defined(LIGHTPROBE_SH) && !defined(UNITY_PASS_FORWARDADD) && !defined(UNITY_PASS_SHADOWCASTER) && !defined(UNITY_PASS_META))

#if defined (DIRECTIONAL) || defined (DIRECTIONAL_COOKIE) || defined (POINT) || defined (SPOT) || defined (POINT_NOATT) || defined (POINT_COOKIE)
#define USING_LIGHT_MULTI_COMPILE
#endif

#if defined(SHADER_API_D3D11) || defined(SHADER_API_PSSL) || defined(SHADER_API_METAL) || defined(SHADER_API_GLCORE) || defined(SHADER_API_GLES3) || defined(SHADER_API_VULKAN) || defined(SHADER_API_SWITCH) // D3D11, D3D12, XB1, PS4, iOS, macOS, tvOS, glcore, gles3, webgl2.0, Switch
// 实时支持深度格式的立方体阴影地图。
#define SHADOWS_CUBE_IN_DEPTH_TEX
#endif

// 声明3x3矩阵“旋转”，用切线空间基填充
#define TANGENT_SPACE_ROTATION \
    float3 binormal = cross( normalize(v.normal), normalize(v.tangent.xyz) ) * v.tangent.w; \
    float3x3 rotation = float3x3( v.tangent.xyz, binormal, v.normal )

#define SCALED_NORMAL v.normal

// Transforms 2D UV by scale/bias property
#define TRANSFORM_TEX(tex,name) (tex.xy * name##_ST.xy + name##_ST.zw)

// Deprecated. Used to transform 4D UV by a fixed function texture matrix. Now just returns the passed UV.
#define TRANSFORM_UV(idx) v.texcoord.xy

#define UnityStereoScreenSpaceUVAdjust(x, y)UnityStereoScreenSpaceUVAdjustInternal(x, y)

// Depth render texture helpers
#define DECODE_EYEDEPTH(i) LinearEyeDepth(i)
#define COMPUTE_EYEDEPTH(o) o = -UnityObjectToViewPos( v.vertex ).z
#define COMPUTE_DEPTH_01 -(UnityObjectToViewPos( v.vertex ).z * _ProjectionParams.w)
#define COMPUTE_VIEW_NORMAL normalize(mul((float3x3)UNITY_MATRIX_IT_MV, v.normal))

// Projected screen position helpers
#define V2F_SCREEN_TYPE float4

#if defined(SHADOWS_CUBE) && !defined(SHADOWS_CUBE_IN_DEPTH_TEX)
    // Rendering into point light (cubemap) shadows
    #define V2F_SHADOW_CASTER_NOPOS float3 vec : TEXCOORD0;
    #define TRANSFER_SHADOW_CASTER_NOPOS_LEGACY(o,opos) o.vec = mul(unity_ObjectToWorld, v.vertex).xyz - _LightPositionRange.xyz; opos = UnityObjectToClipPos(v.vertex);
    #define TRANSFER_SHADOW_CASTER_NOPOS(o,opos) o.vec = mul(unity_ObjectToWorld, v.vertex).xyz - _LightPositionRange.xyz; opos = UnityObjectToClipPos(v.vertex);
    #define SHADOW_CASTER_FRAGMENT(i) return UnityEncodeCubeShadowDepth ((length(i.vec) + unity_LightShadowBias.x) * _LightPositionRange.w);

#else
    // Rendering into directional or spot light shadows
    #define V2F_SHADOW_CASTER_NOPOS
    // Let embedding code know that V2F_SHADOW_CASTER_NOPOS is empty; so that it can workaround
    // empty structs that could possibly be produced.
    #define V2F_SHADOW_CASTER_NOPOS_IS_EMPTY
    #define TRANSFER_SHADOW_CASTER_NOPOS_LEGACY(o,opos) \
        opos = UnityObjectToClipPos(v.vertex.xyz); \
        opos = UnityApplyLinearShadowBias(opos);
    #define TRANSFER_SHADOW_CASTER_NOPOS(o,opos) \
        opos = UnityClipSpaceShadowCasterPos(v.vertex, v.normal); \
        opos = UnityApplyLinearShadowBias(opos);
    #define SHADOW_CASTER_FRAGMENT(i) return 0;
#endif

// Declare all data needed for shadow caster pass output (any shadow directions/depths/distances as needed),
// plus clip space position.
#define V2F_SHADOW_CASTER V2F_SHADOW_CASTER_NOPOS UNITY_POSITION(pos)

// Vertex shader part, with support for normal offset shadows. Requires
// position and normal to be present in the vertex input.
#define TRANSFER_SHADOW_CASTER_NORMALOFFSET(o) TRANSFER_SHADOW_CASTER_NOPOS(o,o.pos)

// Vertex shader part, legacy. No support for normal offset shadows - because
// that would require vertex normals, which might not be present in user-written shaders.
#define TRANSFER_SHADOW_CASTER(o) TRANSFER_SHADOW_CASTER_NOPOS_LEGACY(o,o.pos)


// ------------------------------------------------------------------
//  Alpha helper

#define UNITY_OPAQUE_ALPHA(outputAlpha) outputAlpha = 1.0

// ------------------------------------------------------------------
//  Fog helpers
//
//  multi_compile_fog Will compile fog variants.
//  UNITY_FOG_COORDS(texcoordindex) Declares the fog data interpolator.
//  UNITY_TRANSFER_FOG(outputStruct,clipspacePos) Outputs fog data from the vertex shader.
//  UNITY_APPLY_FOG(fogData,col) Applies fog to color "col". Automatically applies black fog when in forward-additive pass.
//  Can also use UNITY_APPLY_FOG_COLOR to supply your own fog color.

// In case someone by accident tries to compile fog code in one of the g-buffer or shadow passes:
// treat it as fog is off.
#if defined(UNITY_PASS_DEFERRED) || defined(UNITY_PASS_SHADOWCASTER)
#undef FOG_LINEAR
#undef FOG_EXP
#undef FOG_EXP2
#endif

#if defined(UNITY_REVERSED_Z)
    #if UNITY_REVERSED_Z == 1
        //D3d with reversed Z => z clip range is [near, 0] -> remapping to [0, far]
        //max is required to protect ourselves from near plane not being correct/meaningfull in case of oblique matrices.
        #define UNITY_Z_0_FAR_FROM_CLIPSPACE(coord) max(((1.0-(coord)/_ProjectionParams.y)*_ProjectionParams.z),0)
    #else
        //GL with reversed z => z clip range is [near, -far] -> should remap in theory but dont do it in practice to save some perf (range is close enough)
        #define UNITY_Z_0_FAR_FROM_CLIPSPACE(coord) max(-(coord), 0)
    #endif
#elif UNITY_UV_STARTS_AT_TOP
    //D3d without reversed z => z clip range is [0, far] -> nothing to do
    #define UNITY_Z_0_FAR_FROM_CLIPSPACE(coord) (coord)
#else
    //Opengl => z clip range is [-near, far] -> should remap in theory but dont do it in practice to save some perf (range is close enough)
    #define UNITY_Z_0_FAR_FROM_CLIPSPACE(coord) (coord)
#endif

#if defined(FOG_LINEAR)
    // factor = (end-z)/(end-start) = z * (-1/(end-start)) + (end/(end-start))
    #define UNITY_CALC_FOG_FACTOR_RAW(coord) float unityFogFactor = (coord) * unity_FogParams.z + unity_FogParams.w
#elif defined(FOG_EXP)
    // factor = exp(-density*z)
    #define UNITY_CALC_FOG_FACTOR_RAW(coord) float unityFogFactor = unity_FogParams.y * (coord); unityFogFactor = exp2(-unityFogFactor)
#elif defined(FOG_EXP2)
    // factor = exp(-(density*z)^2)
    #define UNITY_CALC_FOG_FACTOR_RAW(coord) float unityFogFactor = unity_FogParams.x * (coord); unityFogFactor = exp2(-unityFogFactor*unityFogFactor)
#else
    #define UNITY_CALC_FOG_FACTOR_RAW(coord) float unityFogFactor = 0.0
#endif

#define UNITY_CALC_FOG_FACTOR(coord) UNITY_CALC_FOG_FACTOR_RAW(UNITY_Z_0_FAR_FROM_CLIPSPACE(coord))

#define UNITY_FOG_COORDS_PACKED(idx, vectype) vectype fogCoord : TEXCOORD##idx;

#if defined(FOG_LINEAR) || defined(FOG_EXP) || defined(FOG_EXP2)
    #define UNITY_FOG_COORDS(idx) UNITY_FOG_COORDS_PACKED(idx, float1)

    #if (SHADER_TARGET < 30) || defined(SHADER_API_MOBILE)
        // mobile or SM2.0: calculate fog factor per-vertex
        #define UNITY_TRANSFER_FOG(o,outpos) UNITY_CALC_FOG_FACTOR((outpos).z); o.fogCoord.x = unityFogFactor
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_TSPACE(o,outpos) UNITY_CALC_FOG_FACTOR((outpos).z); o.tSpace1.y = tangentSign; o.tSpace2.y = unityFogFactor
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_WORLD_POS(o,outpos) UNITY_CALC_FOG_FACTOR((outpos).z); o.worldPos.w = unityFogFactor
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_EYE_VEC(o,outpos) UNITY_CALC_FOG_FACTOR((outpos).z); o.eyeVec.w = unityFogFactor
    #else
        // SM3.0 and PC/console: calculate fog distance per-vertex, and fog factor per-pixel
        #define UNITY_TRANSFER_FOG(o,outpos) o.fogCoord.x = (outpos).z
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_TSPACE(o,outpos) o.tSpace2.y = (outpos).z
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_WORLD_POS(o,outpos) o.worldPos.w = (outpos).z
        #define UNITY_TRANSFER_FOG_COMBINED_WITH_EYE_VEC(o,outpos) o.eyeVec.w = (outpos).z
    #endif
#else
    #define UNITY_FOG_COORDS(idx)
    #define UNITY_TRANSFER_FOG(o,outpos)
    #define UNITY_TRANSFER_FOG_COMBINED_WITH_TSPACE(o,outpos)
    #define UNITY_TRANSFER_FOG_COMBINED_WITH_WORLD_POS(o,outpos)
    #define UNITY_TRANSFER_FOG_COMBINED_WITH_EYE_VEC(o,outpos)
#endif

#define UNITY_FOG_LERP_COLOR(col,fogCol,fogFac) col.rgb = lerp((fogCol).rgb, (col).rgb, saturate(fogFac))


#if defined(FOG_LINEAR) || defined(FOG_EXP) || defined(FOG_EXP2)
    #if (SHADER_TARGET < 30) || defined(SHADER_API_MOBILE)
        // mobile or SM2.0: fog factor was already calculated per-vertex, so just lerp the color
        #define UNITY_APPLY_FOG_COLOR(coord,col,fogCol) UNITY_FOG_LERP_COLOR(col,fogCol,(coord).x)
    #else
        // SM3.0 and PC/console: calculate fog factor and lerp fog color
        #define UNITY_APPLY_FOG_COLOR(coord,col,fogCol) UNITY_CALC_FOG_FACTOR((coord).x); UNITY_FOG_LERP_COLOR(col,fogCol,unityFogFactor)
    #endif
    #define UNITY_EXTRACT_FOG(name) float _unity_fogCoord = name.fogCoord
    #define UNITY_EXTRACT_FOG_FROM_TSPACE(name) float _unity_fogCoord = name.tSpace2.y
    #define UNITY_EXTRACT_FOG_FROM_WORLD_POS(name) float _unity_fogCoord = name.worldPos.w
    #define UNITY_EXTRACT_FOG_FROM_EYE_VEC(name) float _unity_fogCoord = name.eyeVec.w
#else
    #define UNITY_APPLY_FOG_COLOR(coord,col,fogCol)
    #define UNITY_EXTRACT_FOG(name)
    #define UNITY_EXTRACT_FOG_FROM_TSPACE(name)
    #define UNITY_EXTRACT_FOG_FROM_WORLD_POS(name)
    #define UNITY_EXTRACT_FOG_FROM_EYE_VEC(name)
#endif

#ifdef UNITY_PASS_FORWARDADD
    #define UNITY_APPLY_FOG(coord,col) UNITY_APPLY_FOG_COLOR(coord,col,fixed4(0,0,0,0))
#else
    #define UNITY_APPLY_FOG(coord,col) UNITY_APPLY_FOG_COLOR(coord,col,unity_FogColor)
#endif

// ------------------------------------------------------------------
//  TBN helpers
#define UNITY_EXTRACT_TBN_0(name) fixed3 _unity_tbn_0 = name.tSpace0.xyz
#define UNITY_EXTRACT_TBN_1(name) fixed3 _unity_tbn_1 = name.tSpace1.xyz
#define UNITY_EXTRACT_TBN_2(name) fixed3 _unity_tbn_2 = name.tSpace2.xyz

#define UNITY_EXTRACT_TBN(name) UNITY_EXTRACT_TBN_0(name); UNITY_EXTRACT_TBN_1(name); UNITY_EXTRACT_TBN_2(name)

#define UNITY_EXTRACT_TBN_T(name) fixed3 _unity_tangent = fixed3(name.tSpace0.x, name.tSpace1.x, name.tSpace2.x)
#define UNITY_EXTRACT_TBN_N(name) fixed3 _unity_normal = fixed3(name.tSpace0.z, name.tSpace1.z, name.tSpace2.z)
#define UNITY_EXTRACT_TBN_B(name) fixed3 _unity_binormal = cross(_unity_normal, _unity_tangent)
#define UNITY_CORRECT_TBN_B_SIGN(name) _unity_binormal *= name.tSpace1.y;
#define UNITY_RECONSTRUCT_TBN_0 fixed3 _unity_tbn_0 = fixed3(_unity_tangent.x, _unity_binormal.x, _unity_normal.x)
#define UNITY_RECONSTRUCT_TBN_1 fixed3 _unity_tbn_1 = fixed3(_unity_tangent.y, _unity_binormal.y, _unity_normal.y)
#define UNITY_RECONSTRUCT_TBN_2 fixed3 _unity_tbn_2 = fixed3(_unity_tangent.z, _unity_binormal.z, _unity_normal.z)

#if defined(FOG_LINEAR) || defined(FOG_EXP) || defined(FOG_EXP2)
    #define UNITY_RECONSTRUCT_TBN(name) UNITY_EXTRACT_TBN_T(name); UNITY_EXTRACT_TBN_N(name); UNITY_EXTRACT_TBN_B(name); UNITY_CORRECT_TBN_B_SIGN(name); UNITY_RECONSTRUCT_TBN_0; UNITY_RECONSTRUCT_TBN_1; UNITY_RECONSTRUCT_TBN_2
#else
    #define UNITY_RECONSTRUCT_TBN(name) UNITY_EXTRACT_TBN(name)
#endif

//  LOD cross fade helpers
// keep all the old macros
#define UNITY_DITHER_CROSSFADE_COORDS
#define UNITY_DITHER_CROSSFADE_COORDS_IDX(idx)
#define UNITY_TRANSFER_DITHER_CROSSFADE(o,v)
#define UNITY_TRANSFER_DITHER_CROSSFADE_HPOS(o,hpos)

#ifdef LOD_FADE_CROSSFADE
    #define UNITY_APPLY_DITHER_CROSSFADE(vpos)  UnityApplyDitherCrossFade(vpos)
    sampler2D unity_DitherMask;
    void UnityApplyDitherCrossFade(float2 vpos)
    {
        vpos /= 4; // the dither mask texture is 4x4
        float mask = tex2D(unity_DitherMask, vpos).a;
        float sgn = unity_LODFade.x > 0 ? 1.0f : -1.0f;
        clip(unity_LODFade.x - mask * sgn);
    }
#else
    #define UNITY_APPLY_DITHER_CROSSFADE(vpos)
#endif


// ------------------------------------------------------------------
//  Deprecated things: these aren't used; kept here
//  just so that various existing shaders still compile, more or less.


// Note: deprecated shadow collector pass helpers
#ifdef SHADOW_COLLECTOR_PASS

#if !defined(SHADOWMAPSAMPLER_DEFINED)
UNITY_DECLARE_SHADOWMAP(_ShadowMapTexture);
#endif

// Note: V2F_SHADOW_COLLECTOR and TRANSFER_SHADOW_COLLECTOR are deprecated
#define V2F_SHADOW_COLLECTOR float4 pos : SV_POSITION; float3 _ShadowCoord0 : TEXCOORD0; float3 _ShadowCoord1 : TEXCOORD1; float3 _ShadowCoord2 : TEXCOORD2; float3 _ShadowCoord3 : TEXCOORD3; float4 _WorldPosViewZ : TEXCOORD4
#define TRANSFER_SHADOW_COLLECTOR(o)    \
    o.pos = UnityObjectToClipPos(v.vertex); \
    float4 wpos = mul(unity_ObjectToWorld, v.vertex); \
    o._WorldPosViewZ.xyz = wpos; \
    o._WorldPosViewZ.w = -UnityObjectToViewPos(v.vertex).z; \
    o._ShadowCoord0 = mul(unity_WorldToShadow[0], wpos).xyz; \
    o._ShadowCoord1 = mul(unity_WorldToShadow[1], wpos).xyz; \
    o._ShadowCoord2 = mul(unity_WorldToShadow[2], wpos).xyz; \
    o._ShadowCoord3 = mul(unity_WorldToShadow[3], wpos).xyz;

// Note: SAMPLE_SHADOW_COLLECTOR_SHADOW is deprecated
#define SAMPLE_SHADOW_COLLECTOR_SHADOW(coord) \
    half shadow = UNITY_SAMPLE_SHADOW(_ShadowMapTexture,coord); \
    shadow = _LightShadowData.r + shadow * (1-_LightShadowData.r);

// Note: COMPUTE_SHADOW_COLLECTOR_SHADOW is deprecated
#define COMPUTE_SHADOW_COLLECTOR_SHADOW(i, weights, shadowFade) \
    float4 coord = float4(i._ShadowCoord0 * weights[0] + i._ShadowCoord1 * weights[1] + i._ShadowCoord2 * weights[2] + i._ShadowCoord3 * weights[3], 1); \
    SAMPLE_SHADOW_COLLECTOR_SHADOW(coord) \
    float4 res; \
    res.x = saturate(shadow + shadowFade); \
    res.y = 1.0; \
    res.zw = EncodeFloatRG (1 - i._WorldPosViewZ.w * _ProjectionParams.w); \
    return res;

// Note: deprecated
#if defined (SHADOWS_SPLIT_SPHERES)
#define SHADOW_COLLECTOR_FRAGMENT(i) \
    float3 fromCenter0 = i._WorldPosViewZ.xyz - unity_ShadowSplitSpheres[0].xyz; \
    float3 fromCenter1 = i._WorldPosViewZ.xyz - unity_ShadowSplitSpheres[1].xyz; \
    float3 fromCenter2 = i._WorldPosViewZ.xyz - unity_ShadowSplitSpheres[2].xyz; \
    float3 fromCenter3 = i._WorldPosViewZ.xyz - unity_ShadowSplitSpheres[3].xyz; \
    float4 distances2 = float4(dot(fromCenter0,fromCenter0), dot(fromCenter1,fromCenter1), dot(fromCenter2,fromCenter2), dot(fromCenter3,fromCenter3)); \
    float4 cascadeWeights = float4(distances2 < unity_ShadowSplitSqRadii); \
    cascadeWeights.yzw = saturate(cascadeWeights.yzw - cascadeWeights.xyz); \
    float sphereDist = distance(i._WorldPosViewZ.xyz, unity_ShadowFadeCenterAndType.xyz); \
    float shadowFade = saturate(sphereDist * _LightShadowData.z + _LightShadowData.w); \
    COMPUTE_SHADOW_COLLECTOR_SHADOW(i, cascadeWeights, shadowFade)
#else
#define SHADOW_COLLECTOR_FRAGMENT(i) \
    float4 viewZ = i._WorldPosViewZ.w; \
    float4 zNear = float4( viewZ >= _LightSplitsNear ); \
    float4 zFar = float4( viewZ < _LightSplitsFar ); \
    float4 cascadeWeights = zNear * zFar; \
    float shadowFade = saturate(i._WorldPosViewZ.w * _LightShadowData.z + _LightShadowData.w); \
    COMPUTE_SHADOW_COLLECTOR_SHADOW(i, cascadeWeights, shadowFade)
#endif

#endif // #ifdef SHADOW_COLLECTOR_PASS


// Legacy; used to do something on platforms that had to emulate depth textures manually. Now all platforms have native depth textures.
#define UNITY_TRANSFER_DEPTH(oo)
// Legacy; used to do something on platforms that had to emulate depth textures manually. Now all platforms have native depth textures.
#define UNITY_OUTPUT_DEPTH(i) return 0



#define API_HAS_GUARANTEED_R16_SUPPORT !(SHADER_API_VULKAN || SHADER_API_GLES || SHADER_API_GLES3)


```
