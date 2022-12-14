import React, { useState } from 'react'
import style from './style.module.scss'
import Button from '../Button'
import clsx from 'clsx'
import { HeadIcon, MoneyIcon } from '../../assets/icon'
import { showSalary } from '../../pages/postJob/steps/preview'
import draftToHtml from 'draftjs-to-html'
import { JobAPI } from '../../api/job'
import { useDispatch, useSelector } from 'react-redux'
import { disableLoadMore, selectLoadMore } from '../../redux/homeSlice'
import { setJobToShowModal } from '../../redux/jobSlice'
import { openApplyModal, selectApplyModal } from '../../redux/modalSlice'
import Animation from '../../components/Animation'
import noData from '../../assets/animations/noData'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { letterAPI } from '../../api/letter'
import { selectUser } from '../../redux/usrSlice'

const NoneData = ({ title = 'Bạn đang ở trang cuối', key }) => {
  return (
    <div
      key={key}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '40px',
      }}
    >
      <div style={{ width: '150px' }}>
        <Animation animationData={noData} />
      </div>
      <strong className={{ fontWeight: '800' }}> {title} </strong>
    </div>
  )
}
export const convertTime = (time, start) => {
  const createdAt = Date.parse(time)
  const result = Math.abs(new Date() - new Date(createdAt))
  let seconds = Math.floor(result / 1000)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  if (hours === 0) return `${start} gần đây`
  let days = Math.floor(hours / 24)
  if (days === 0) return `${start} ${hours} giờ trước`
  let weeks = Math.floor(days / 7)
  if (weeks === 0) return `${start} ${days} ngày trước`
  let months = Math.floor(weeks / 30)
  if (months === 0) return `${start} ${weeks} tuần trước`
  return `${start} ${months} tháng trước`
}
const ListJob = ({ jobs, setJobDetail, jobDetail, condition, setJobs }) => {
  const dispatch = useDispatch()
  const loadMore = useSelector(selectLoadMore)

  const handleClick = (job) => {
    setJobDetail(job)
  }
  const handleLoadMore = () => {
    const params = {
      offset: jobs.length,
      jobName: condition.jobName,
      location: condition.location,
    }
    JobAPI.loadMoreJob(params).then((response) => {
      if (response.data.length > 0) {
        console.log(response.data)
        for (const data of response.data) {
          setJobs((oldJobs) => [...oldJobs, data])
        }
      } else {
        setJobs((oldJobs) => [...oldJobs, 'none'])
        dispatch(disableLoadMore())
      }
    })
  }
  return (
    <div className={style.listJob}>
      {jobs.map((job, index) => (
        <>
          {job === 'none' ? (
            <NoneData key={index} />
          ) : (
            <div
              key={job._id}
              className={clsx(style.job, {
                [style.job__active]: jobDetail?._id === job?._id,
              })}
              onClick={() => handleClick(job)}
            >
              <h2>{job.jobName}</h2>
              <p>{job.companyName}</p>
              <p>{job.location}</p>

              {job.salary !== null ? (
                <div className={style.job__salary} style={{ display: 'flex' }}>
                  <MoneyIcon />
                  {showSalary(job.salary)}
                </div>
              ) : null}

              <div className={style.posted}>{convertTime(job.createdAt, 'Đã đăng')}</div>
            </div>
          )}
        </>
      ))}

      <button
        className={clsx(style.moreBtn, {
          [style.btnDisable]: !loadMore,
        })}
        onClick={loadMore ? handleLoadMore : () => console.log('disableLoadMore')}
      >
        Hiển thị thêm việc làm
      </button>
    </div>
  )
}

const JobDetail = ({ jobDetail }) => {
  const dispatch = useDispatch()
  const data = JSON.parse(jobDetail.jobDescription)
  const marked = draftToHtml(data)
  const handleToApply = () => {
    dispatch(setJobToShowModal(jobDetail))
    dispatch(openApplyModal())
  }
  const user = useSelector(selectUser)
  const saveJob = () => {
    const userId = user._id
    const jobId = jobDetail._id
    letterAPI.saveJob(jobId, userId).then(
      toast.success('Lưu thành công', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    )
  }

  return (
    <div className={style.jobDetail}>
      <div className={style.jobDetail__header}>
        <h2>{jobDetail.jobName}</h2>
        <p>
          {jobDetail.companyName}
          <br />
          Địa điểm: {jobDetail.location}
        </p>
        <div className={style.jobDetail__header__buttonContainer}>
          <Button title={'Ứng tuyển ngay'} onClick={handleToApply} />
          <button
            className={style.savedBtn}
            style={{
              marginLeft: '20px',
              borderRadius: '10px',
              border: 'none',
              padding: '10px 20px',
            }}
            type="button"
            onClick={saveJob}
          >
            <HeadIcon />
          </button>
        </div>
      </div>

      <div className={style.jobDetail__body}>
        <div dangerouslySetInnerHTML={{ __html: marked }}></div>
        <div className={style.jobDetail__body__insights}>
          <h2>Thông tin tuyển dụng</h2>
          <ul>
            <li>
              Cần tuyển dụng{' '}
              {jobDetail.jobDetail.amountOfJob === '999' ? (
                <span>liên tục</span>
              ) : (
                <span>{jobDetail.jobDetail.amountOfJob} người</span>
              )}{' '}
              cho vị trí này
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const Jobs = ({ jobs, condition, setJobs }) => {
  const [jobDetail, setJobDetail] = useState(jobs[0])

  return (
    <div className={style.container}>
      {jobs.length !== 0 ? (
        <>
          <ListJob
            jobs={jobs}
            setJobs={setJobs}
            setJobDetail={setJobDetail}
            jobDetail={jobDetail}
            condition={condition}
          />
          {jobDetail && <JobDetail jobDetail={jobDetail} />}
        </>
      ) : (
        <NoneData title={'Không tìm thấy việc làm '} />
      )}
    </div>
  )
}

export default Jobs
