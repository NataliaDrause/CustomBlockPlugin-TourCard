import "./index.scss"
import {TextControl, Flex, FlexBlock, FlexItem, Button, Icon} from "@wordpress/components"
import {useSelect} from "@wordpress/data"
import {useState, useEffect} from "react"
import apiFetch from "@wordpress/api-fetch"

(function() {
  let locked = false
  wp.data.subscribe(function() {
    const results = wp.data.select("core/block-editor").getBlocks().filter(function(block) {
      return block.name == "nd-plugin/nd-tours-block" && !block.attributes.tourId
    })
    if (results.length && locked == false) {
      locked = true
      wp.data.dispatch("core/editor").lockPostSaving("noTourSelected")
    }
    if (!results.length && locked) {
      locked = false
      wp.data.dispatch("core/editor").unlockPostSaving("noTourSelected")
    }
  })
})()

wp.blocks.registerBlockType("nd-plugin/nd-tours-block", {
  title: "Tours",
  description: "Include a short tour description and link to a tour",
  icon: "location-alt",
  category: "common",
  attributes: {
    tourId: {type: "string"},
    bulletList: {type: "array", default: [""]}
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

  // Delete a bullet point.
  function deleteBullet(indexToDelete) {
    const newBulletList = props.attributes.bulletList.filter(function(x, index) {
      return index !== indexToDelete
    })
    props.setAttributes({bulletList: newBulletList})
  }

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
        <p>Add bullet points:</p>
          {props.attributes.bulletList.map(function (bullet, index) {
            return (
              <Flex>
                <FlexBlock>
                  <TextControl autoFocus={bullet == undefined} value={bullet} onChange={newVal => {
                    const newBulletList = props.attributes.bulletList.concat([])
                    newBulletList[index] = newVal
                    props.setAttributes({bulletList: newBulletList})
                  }} />
                </FlexBlock>
                <FlexItem>
                  <Button variant="link" className="bulletpoint-delete" onClick={() => deleteBullet(index)}>Delete</Button>
                </FlexItem>
              </Flex>
            )
          })}
        <Button variant="primary" onClick={() => {
          props.setAttributes({bulletList: props.attributes.bulletList.concat([undefined])})
        }}>Add another answer</Button>
      </div>
      <div dangerouslySetInnerHTML={{__html: thePreview}}></div>
    </div>
  )
}