import React from 'react'
import axios from "axios";
import {useForm} from 'react-hook-form';
import {useHistory} from "react-router-dom";
import 'cirrus-ui';
import Navbar from "./Navbar";

function Citizen() {
  // const fetchUserInfo = async (citizen_id) => {
  //     const res = await fetch(`https://wcg-apis.herokuapp.com/citizen/${citizen_id}`)
  //     const data = await res.json()

  //     return data
  // }
  const {register, handleSubmit, setError, trigger, formState: {errors}} = useForm();
  const base_url = 'https://wcg-apis.herokuapp.com';
  let history = useHistory();

  const config = {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  };

  const onSubmit = async (data, event) => {
    event.preventDefault();
    console.log(data.citizen_id)
    console.log(event)

    await axios.all([
      axios.get(`${base_url}/registration/${data.citizen_id}`, config),
      axios.get(`${base_url}/reservation/${data.citizen_id}`, config)
    ])
      .then(axios.spread((reg, reservation) => {
        const register_data = reg.data;
        const reservation_data = reservation.data;
        const register_feedback = register_data.feedback;
        if (register_feedback === "report failed: citizen ID is not registered") {
          setError("citizen_id", {
            type: "manual",
            message: "This Citizen ID is not registered."
          });
        } else {
          history.push(`/citizen/${register_data.citizen_id}`, {register_data, reservation_data})
        }
      }))
      .catch(function (error) {
        console.log(error)
      })
  };
  console.log(errors);

  return (
    <div className="hero fullscreen">
      <Navbar />
      <div className="content">
        <div style={{margin: "auto"}}>
          <form className="frame p-0" method="post" autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
            <div className="frame__body p-0">
              <div className="row p-0 level fill-height">
                <div className="col">
                  <div className="space xlarge" />
                  <div className="padded">
                    <h1 className="u-text-center u-font-alt">Citizen Page</h1>
                    <div className="divider" />
                    <p className="u-text-center">See your information about vaccine reservation.</p>
                    <div className="divider" />

                    <div className="mb-1">
                      <label className="font-bold">Citizen ID <span className="required">*</span> <span
                        className="info inline font-light">Please input your real ID.</span></label>
                      <div className="section-body">
                        <div className="input-control">
                          <input type="number"
                                 className={`input-contains-icon input-contains-icon input-contains-icon-left ${errors.citizen_id && "text-danger input-error"}`}
                                 placeholder="Citizen ID"
                                 {...register("citizen_id", {
                                   required: "Citizen ID is required",
                                   minLength: {value: 13, message: 'Citizen ID must be at least 13 characters long'},
                                   maxLength: {value: 13, message: 'Citizen ID must be at most 13 characters long'}
                                 })} onKeyUp={() => {
                            trigger("citizen_id");
                          }} />
                          <span className="icon icon-left"><i
                            className={`fa fa-wrapper fa-id-card ${errors.citizen_id && "text-danger input-error"}`}
                            aria-hidden="true" /></span>
                        </div>
                      </div>
                      {errors.citizen_id && <span className="required info">{errors.citizen_id.message}</span>}
                    </div>

                    <div className="space" />

                    <div className="btn-group u-pull-right">
                      <button className="btn-success" type="submit">Submit</button>
                    </div>

                  </div>
                  <div className="space xlarge" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Citizen
