import "./index.scss"
import {useSelect} from "@wordpress/data"

wp.blocks.registerBlockType("nd-plugin/nd-tours-block", {
  title: "Tours",
  description: "Include a short tour description and link to a tour",
  icon: "location-alt",
  category: "common",
  attributes: {
    tourId: {type: "string"}
  },
  edit: EditComponent,
  save: function () {
    return null
  }
})

function EditComponent(props) {

  const allTours = useSelect(select => {
    return select("core").getEntityRecords("postType", "tour", {per_page: -1})
  })

  console.log(allTours)

  if (allTours == undefined) return <p>Loading...</p>

  return (
    <div className="wrapper">
      <div className="tour-block-select-container">
        <select onChange={e => props.setAttributes({tourId: e.target.value})}>
          <option value="">Select a tour</option>
          {allTours.map(tour => {
            return (
              <option value={tour.id} selected={props.attributes.tourId == tour.id}>
                {tour.title.rendered}
                </option>
            )
          })}
        </select>
      </div>
      <div>
        The HTML preview of the selected tour will appear here.
      </div>
    </div>
  )
}