import "./index.scss"

wp.blocks.registerBlockType("nd-plugin/nd-tours-block", {
  title: "Tours",
  description: "Include a short tour description and link to a tour",
  icon: "location-alt",
  category: "common",
  edit: EditComponent,
  save: function () {
    return null
  }
})

function EditComponent() {
  return (
    <div className="wrapper">
      <div className="container">
        We will have a select dropdown form element here.
      </div>
      <div>
        The HTML preview of the selected tour will appear here.
      </div>
    </div>
  )
}