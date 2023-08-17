import ImageDB from "../plugin/ImageDB"; // Plugin for displaying for Symbol
import ContentDB from "../plugin/ContentFromDB"; // Plugin for displaying HTML file

export const addPlugins = () => {
  if (!window.tinymce.PluginManager.get("ImageDB")) {
    window.tinymce.PluginManager.add("ImageDB", ImageDB);
  }
  if (!window.tinymce.PluginManager.get("ContentDB")) {
    window.tinymce.PluginManager.add("ContentDB", ContentDB);
  }
};
