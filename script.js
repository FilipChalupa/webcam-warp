;(async () => {
	const currentUrl = new URL(document.location)
	if (currentUrl.searchParams.get('reset') !== null) {
		localStorage.removeItem('lastDeviceId')
		currentUrl.searchParams.delete('reset')
		location.href = currentUrl.toString()
	}

	const $video = document.querySelector('.video')
	const $picker = document.querySelector('.picker')
	const $pickerCameraSelect = $picker.querySelector('select')
	const $handles = document.querySelectorAll('.handle')

	const handlesPositions = [
		{ x: 100, y: 100 },
		{ x: 100, y: 200 },
		{ x: 200, y: 100 },
		{ x: 200, y: 200 },
	]

	const updateHandlesPositions = () => {
		$handles.forEach(($handle, i) => {
			$handle.style.setProperty('--x', `${handlesPositions[i].x}px`)
			$handle.style.setProperty('--y', `${handlesPositions[i].y}px`)
		})
	}

	const selectCamera = async (deviceId) => {
		localStorage.setItem('lastDeviceId', deviceId)
		const constraints = {
			video: {
				deviceId: {
					exact: deviceId,
				},
			},
			audio: false,
		}
		const stream = await navigator.mediaDevices.getUserMedia(constraints)
		$video.srcObject = stream
		$picker.remove()
		updateHandlesPositions()
	}

	await navigator.mediaDevices.getUserMedia({ audio: false, video: true })
	const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
		(device) => device.kind === 'videoinput',
	)

	const lastDeviceId = localStorage.getItem('lastDeviceId')
	if (
		lastDeviceId &&
		cameras.some((camera) => camera.deviceId === lastDeviceId)
	) {
		selectCamera(lastDeviceId)
	}
	$pickerCameraSelect.innerHTML = ''
	$pickerCameraSelect.innerHTML += `<option>Choose</option>`
	cameras.forEach((camera, i) => {
		$pickerCameraSelect.innerHTML += `<option value="${camera.deviceId}">${
			camera.label || `Camera ${i + 1}`
		}</option>`
	})

	$pickerCameraSelect.addEventListener('change', () => {
		selectCamera($pickerCameraSelect.value)
	})

	$handles.forEach(($handle, i) => {
		let offsetX = 0
		let offsetY = 0
		const onStart = (event) => {
			$handle.addEventListener('pointermove', onMove)
			$handle.setPointerCapture(event.pointerId)
			offsetX = event.clientX - handlesPositions[i].x
			offsetY = event.clientY - handlesPositions[i].y
		}
		const onMove = (event) => {
			handlesPositions[i].x = event.clientX - offsetX
			handlesPositions[i].y = event.clientY - offsetY
			updateHandlesPositions()
		}
		const onEnd = (event) => {
			$handle.removeEventListener('pointermove', onMove)
			$handle.releasePointerCapture(event.pointerId)
		}

		$handle.addEventListener('pointerdown', onStart)
		$handle.addEventListener('pointerup', onEnd)
	})
})()
