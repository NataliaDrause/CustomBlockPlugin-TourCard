import "./index.scss"
import {useSelect} from "@wordpress/data"
import {useState, useEffect} from "react"
import apiFetch from "@wordpress/api-fetch"

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

  // Preview rendering
  const [thePreview, setThePreview] = useState("")
  useEffect(() => {
    if (props.attributes.tourId) {
      async function go() {
        const response = await apiFetch({
          path: `/ndtourblock/v1/getHTML?tourId=${props.attributes.tourId}`,
          method: "GET"
        })
        setThePreview(response)
      }
      go()
    }
  }, [props.attributes.tourId])

  // Display the block on the backend
  const allTours = useSelect(select => {
    return select("core").getEntityRecords("postType", "tour", {per_page: -1})
  })

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
      <div dangerouslySetInnerHTML={{__html: thePreview}}></div>
    </div>
  )
}