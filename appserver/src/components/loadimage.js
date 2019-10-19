import cornerstone from 'cornerstone-core'
import cornerstoneWebImageLoader from 'cornerstone-web-image-loader'
   
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
    
cornerstoneWebImageLoader.configure({
   beforeSend: function(xhr) {
   }
});
